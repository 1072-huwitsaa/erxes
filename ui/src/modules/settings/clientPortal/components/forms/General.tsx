import BoardSelect from 'erxes-ui/lib/boards/containers/BoardSelect';
import { FlexContent } from 'erxes-ui/lib/layout/styles';
import { PipelinePopoverContent } from 'modules/boards/styles/item';
import { IBoard, IPipeline } from 'modules/boards/types';
import AvatarUpload from 'modules/common/components/AvatarUpload';
import {
  ControlLabel,
  FormControl,
  FormGroup
} from 'modules/common/components/form';
import Icon from 'modules/common/components/Icon';
import { ITopic } from 'modules/knowledgeBase/types';
import React, { useState } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import Select from 'react-select-plus';
import { Content } from '../../styles';
import { ClientPortalConfig } from '../../types';

type Props = {
  topics: ITopic[];
  boards: IBoard[];
  pipelines: IPipeline[];
  fetchPipelines: (boardId: string) => void;
  handleFormChange: (name: string, value: string) => void;
} & ClientPortalConfig;

type OptionItem = {
  label: string;
  value: string;
};

type ControlItem = {
  required?: boolean;
  label: string;
  subtitle?: string;
  formValueName: string;
  formValue?: string;
  boardType?: string;
  placeholder?: string;
  formProps?: any;
  stageId?: string;
  pipelineId?: string;
  boardId?: string;
  url?: string;
};

function General({
  name,
  description,
  icon,
  logo,
  url,
  knowledgeBaseLabel,
  knowledgeBaseTopicId,
  taskPublicBoardId,
  taskPublicPipelineId,
  topics,
  boards,
  pipelines,
  ticketLabel,
  taskLabel,
  taskStageId,
  taskPipelineId,
  taskBoardId,
  ticketStageId,
  ticketPipelineId,
  ticketBoardId,
  fetchPipelines,
  handleFormChange
}: Props) {
  const [show, setShow] = useState<boolean>(false);

  const handleToggleBoardSelect = () => setShow(!show);
  const handleSelectChange = (option?: { value: string; label: string }) => {
    handleFormChange('knowledgeBaseTopicId', !option ? '' : option.value);
  };

  function generateOptions(options: any, valueKey: string, labelKey: string) {
    if ((options || []).length === 0) {
      return [];
    }

    return options.map(option => ({
      value: option[valueKey],
      label: option[labelKey]
    }));
  }

  function renderBoardSelect({
    type,
    stageId,
    boardId,
    pipelineId
  }: {
    type: string;
    stageId?: string;
    boardId?: string;
    pipelineId?: string;
  }) {
    const onChangeStage = stgId => handleFormChange(`${type}StageId`, stgId);
    const onChangePipeline = plId =>
      handleFormChange(`${type}PipelineId`, plId);
    const onChangeBoard = brId => handleFormChange(`${type}BoardId`, brId);

    return (
      <Popover id="pipeline-popover">
        <PipelinePopoverContent>
          <BoardSelect
            type={type}
            stageId={stageId}
            boardId={boardId || ''}
            pipelineId={pipelineId || ''}
            onChangeStage={onChangeStage}
            onChangePipeline={onChangePipeline}
            onChangeBoard={onChangeBoard}
            autoSelectStage={false}
            callback={handleToggleBoardSelect}
          />
        </PipelinePopoverContent>
      </Popover>
    );
  }

  function renderControl({
    required,
    label,
    subtitle,
    formValueName,
    formValue,
    boardType,
    placeholder,
    formProps,
    stageId,
    pipelineId,
    boardId
  }: ControlItem) {
    const handleChange = (e: React.FormEvent) => {
      handleFormChange(
        formValueName,
        (e.currentTarget as HTMLInputElement).value
      );
    };

    return (
      <FormGroup>
        <ControlLabel required={required}>{label}</ControlLabel>
        {subtitle && <p>{subtitle}</p>}
        <FlexContent>
          <FormControl
            {...formProps}
            name={formValueName}
            value={formValue}
            placeholder={placeholder}
            onChange={handleChange}
          />
          {boardType && (
            <OverlayTrigger
              trigger="click"
              placement="bottom-start"
              overlay={renderBoardSelect({
                type: boardType,
                stageId,
                boardId,
                pipelineId
              })}
              rootClose={true}
            >
              <Icon icon="cog" size={24} />
            </OverlayTrigger>
          )}
        </FlexContent>
      </FormGroup>
    );
  }

  function renderTaskPipelines() {
    const renderSelect = (
      options: IBoard[] | IPipeline[],
      handleSelect: (args: OptionItem) => void,
      value?: string
    ) => {
      return (
        <Select
          value={value}
          onChange={handleSelect}
          options={generateOptions(options, '_id', 'name')}
        />
      );
    };

    const handleSelectBoard = (option: OptionItem) => {
      fetchPipelines(option.value);
      handleFormChange('taskPublicBoardId', option.value);
    };

    const handleSelecPipeline = (option: OptionItem) => {
      handleFormChange('taskPublicPipelineId', option.value);
    };

    return (
      <FormGroup>
        <ControlLabel>Task public pipeline</ControlLabel>
        {renderSelect(boards, handleSelectBoard, taskPublicBoardId)}
        {renderSelect(pipelines, handleSelecPipeline, taskPublicPipelineId)}
      </FormGroup>
    );
  }

  function renderFavicon() {
    const handleAvatarUploader = (iconUrl: string) =>
      handleFormChange('icon', iconUrl);

    return (
      <FormGroup>
        <ControlLabel>Favicon</ControlLabel>
        <p>16x16px transparent PNG.</p>
        <AvatarUpload avatar={icon} onAvatarUpload={handleAvatarUploader} />
      </FormGroup>
    );
  }

  function renderLogo() {
    const handleAvatarUploader = (logoUrl: string) =>
      handleFormChange('logo', logoUrl);

    return (
      <FormGroup>
        <ControlLabel>Main Logo</ControlLabel>
        <AvatarUpload avatar={logo} onAvatarUpload={handleAvatarUploader} />
      </FormGroup>
    );
  }

  return (
    <Content>
      {renderControl({
        required: true,
        label: 'Client Portal Name',
        formValueName: 'name',
        formValue: name,
        formProps: {
          autoFocus: true
        }
      })}

      {renderControl({
        label: 'Description',
        formValueName: 'description',
        formValue: description
      })}

      {renderControl({
        label: 'Website',
        formValueName: 'url',
        formValue: url
      })}

      <FlexContent>
        {renderFavicon()}
        {renderLogo()}
      </FlexContent>

      <FlexContent>
        {renderControl({
          label: 'Knowledge Base',
          subtitle: 'Shown name on menu',
          formValueName: 'knowledgeBaseLabel',
          formValue: knowledgeBaseLabel,
          placeholder: 'Please enter a label for Knowledge base'
        })}

        <FormGroup>
          <ControlLabel required={true}>Knowledge base topic</ControlLabel>
          <p>Knowledge base topic in Client Portal</p>
          <Select
            placeholder="Select a knowledge base topic"
            value={knowledgeBaseTopicId}
            options={generateOptions(topics, '_id', 'title')}
            onChange={handleSelectChange}
          />
        </FormGroup>
      </FlexContent>

      {renderControl({
        label: 'Tickets',
        subtitle: 'Shown name on menu',
        formValueName: 'ticketLabel',
        formValue: ticketLabel,
        placeholder: 'Please enter a label for Ticket',
        boardType: 'ticket',
        stageId: ticketStageId,
        pipelineId: ticketPipelineId,
        boardId: ticketBoardId
      })}

      {renderTaskPipelines()}

      {renderControl({
        label: 'Tasks incoming pipeline',
        subtitle: 'Shown name on menu',
        formValueName: 'taskLabel',
        formValue: taskLabel,
        placeholder: 'Please enter a label for Task',
        boardType: 'task',
        stageId: taskStageId,
        pipelineId: taskPipelineId,
        boardId: taskBoardId
      })}
    </Content>
  );
}

export default General;
