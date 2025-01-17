import React from 'react';
import { mount } from 'enzyme';
import PipelineWorkspace from './pipeline-workspace';
import Stage from '../stage';

const PIPELINE_1 = [
  {
    'id': '5df9e37979d8a1f123edc75d',
    'stageOperator': '$match',
    'stage': '/**\n * query: The query in MQL.\n */\n{\n  x: 1\n}',
    'isValid': true,
    'isEnabled': true,
    'isExpanded': true,
    'isLoading': false,
    'isComplete': true,
    'previewDocuments': [],
    'syntaxError': null,
    'error': null,
    'projections': [],
    'snippet': '/**\n * query: The query in MQL.\n */\n{\n  ${1:query}\n}',
    'fromStageOperators': false,
    'executor': {
      '$match': {
        'x': 1
      }
    }
  },
  {
    'id': '5df9e3c579d8a1f123edc763',
    'stageOperator': '$limit',
    'stage': '/**\n * Provide the number of documents to limit.\n */\n3',
    'isValid': true,
    'isEnabled': true,
    'isExpanded': true,
    'isLoading': false,
    'isComplete': true,
    'previewDocuments': [],
    'syntaxError': null,
    'error': null,
    'projections': [],
    'snippet': '/**\n * Provide the number of documents to limit.\n */\n${1:number}',
    'fromStageOperators': false,
    'executor': {
      '$limit': 3
    }
  }
];

/* eslint react/prop-types: 0 */
function createPipelineWorkspace({
  allowWrites = false,
  pipeline = [],
  env = 'atlas',
  toggleInputDocumentsCollapsed = () => {},
  refreshInputDocuments = () => {},
  stageAdded = () => {},
  setIsModified = () => {},
  openLink = () => {},
  isCommenting = false,
  isAutoPreviewing = false,
  inputDocuments = {},
  runStage = () => {},
  runOutStage = () => {},
  gotoOutResults = () => {},
  gotoMergeResults = () => {},
  serverVersion = '4.0.0',
  stageChanged = () => {},
  stageCollapseToggled = () => {},
  stageAddedAfter = () => {},
  stageDeleted = () => {},
  stageMoved = () => {},
  stageOperatorSelected = () => {},
  stageToggled = () => {},
  fields = [],
  isOverviewOn = false,
  projections = [],
  projectionsChanged = () => {},
  newPipelineFromPaste = () => {}
} = {}) {
  return (<PipelineWorkspace
    allowWrites={allowWrites}
    pipeline={pipeline}
    env={env}
    toggleInputDocumentsCollapsed={toggleInputDocumentsCollapsed}
    refreshInputDocuments={refreshInputDocuments}
    stageAdded={stageAdded}
    setIsModified={setIsModified}
    openLink={openLink}
    isCommenting={isCommenting}
    isAutoPreviewing={isAutoPreviewing}
    inputDocuments={inputDocuments}
    runStage={runStage}
    runOutStage={runOutStage}
    gotoOutResults={gotoOutResults}
    gotoMergeResults={gotoMergeResults}
    serverVersion={serverVersion}
    stageChanged={stageChanged}
    stageCollapseToggled={stageCollapseToggled}
    stageAddedAfter={stageAddedAfter}
    stageDeleted={stageDeleted}
    stageMoved={stageMoved}
    stageOperatorSelected={stageOperatorSelected}
    stageToggled={stageToggled}
    fields={fields}
    isOverviewOn={isOverviewOn}
    projections={projections}
    projectionsChanged={projectionsChanged}
    newPipelineFromPaste={newPipelineFromPaste}
  />);
}

describe('PipelineWorkspace [Component]', () => {
  it('renders', () => {
    mount(createPipelineWorkspace());
  });

  it('renders the stages contained in the pipeline', () => {
    const wrapper = mount(createPipelineWorkspace({
      pipeline: PIPELINE_1
    }));
    expect(wrapper.find(Stage)).to.have.lengthOf(2);
  });
});
