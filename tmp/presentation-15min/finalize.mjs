import fs from 'node:fs/promises';
import {constants} from 'node:fs';
fs.link = async (source, destination) => fs.copyFile(source, destination, constants.COPYFILE_EXCL);
import {Presentation,PresentationFile} from 'file:///C:/Users/gurra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';
import {finalizePresentation} from 'file:///C:/Users/gurra/.codex/plugins/cache/openai-primary-runtime/presentations/26.1011.11113/skills/presentations/container_tools/artifact_tool_utils.mjs';
const root='D:/DBMS_DevApp', build=root+'/tmp/presentation-15min';
const skill='C:/Users/gurra/.codex/plugins/cache/openai-primary-runtime/presentations/26.1011.11113/skills/presentations';
process.env.RUNTIME_NODE_MODULES='C:/Users/gurra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const result=await finalizePresentation({workspaceDir:root,candidatePath:build+'/candidate.pptx',finalPath:root+'/output/presentation/DevMatch_AI_15_Minute_Presentation.pptx',pythonExecutable:'C:/Users/gurra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',integrityValidatorPath:skill+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:skill+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],fontPolicy:{basis:'design',families:['Arial']},explicitTotalSlideCount:17,requiredNativeTableOwnerSlides:[],verifyArtifactToolImport:true,receiptPath:build+'/validation.json'});console.log(JSON.stringify(result));


