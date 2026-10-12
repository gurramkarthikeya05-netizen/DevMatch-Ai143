"""Gemini retry and error handling checks without network requests."""

import os
import unittest
from unittest.mock import patch

import requests
from dotenv import load_dotenv

load_dotenv('.env')
import app as project


def response(status, content=None):
    from unittest.mock import Mock
    result = Mock(status_code=status)
    result.json.return_value = content or {
        'candidates': [{'content': {'parts': [{'text': 'Practice SQL and API testing.'}]}}],
    }
    if status >= 400:
        result.raise_for_status.side_effect = requests.HTTPError(response=result)
    return result


class GeminiTests(unittest.TestCase):
    def setUp(self):
        self.key = patch.dict(os.environ, {'GEMINI_API_KEY': 'test-key'})
        self.key.start()
        self.addCleanup(self.key.stop)
        self.sleep = patch('time.sleep')
        self.sleep.start()
        self.addCleanup(self.sleep.stop)

    @patch('requests.post')
    def test_service_unavailable_retries_then_returns_answer(self, post):
        first = response(503)
        post.side_effect = [first, response(200)]
        self.assertIn('SQL', project.gemini_text('Backend skills?'))
        self.assertEqual(post.call_count, 2)
        first.close.assert_called_once()

    @patch('requests.post')
    def test_timeout_retries_then_returns_answer(self, post):
        post.side_effect = [requests.Timeout(), response(200)]
        self.assertIn('SQL', project.gemini_text('Backend skills?'))
        self.assertEqual(post.call_count, 2)

    @patch('requests.post')
    def test_retry_is_bounded(self, post):
        post.return_value = response(503)
        with self.assertRaises(requests.HTTPError) as caught:
            project.gemini_text('Backend skills?')
        self.assertEqual(post.call_count, 2)
        self.assertIn('temporarily unavailable', project.gemini_error_message(caught.exception))

    @patch('requests.post')
    def test_client_errors_and_quota_are_not_retried(self, post):
        for status in (400,403,404,429):
            with self.subTest(status=status):
                post.reset_mock()
                post.return_value = response(status)
                with self.assertRaises(requests.HTTPError):
                    project.gemini_text('Backend skills?')
                self.assertEqual(post.call_count, 1)

    @patch('requests.post')
    def test_timeout_exhaustion_has_clear_message(self, post):
        post.side_effect = requests.Timeout()
        with self.assertRaises(requests.Timeout) as caught:
            project.gemini_text('Backend skills?')
        self.assertEqual(post.call_count, 2)
        self.assertIn('did not respond in time', project.gemini_error_message(caught.exception))

    @patch('requests.post')
    def test_resume_schema_is_preserved(self, post):
        post.return_value = response(200)
        schema = {'type': 'OBJECT'}
        project.gemini_text('Analyze resume', schema)
        config = post.call_args.kwargs['json']['generationConfig']
        self.assertEqual(config['responseSchema'], schema)
        self.assertEqual(config['responseMimeType'], 'application/json')


if __name__ == '__main__':
    unittest.main()
