import Button from 'erxes-ui/lib/components/Button';
import { Alert } from 'modules/common/utils';
import React, { useState } from 'react';
import { CONFIG_TYPES } from '../constants';
import General from '../containers/General';
import { Wrapper } from '../styles';
import { ClientPortalConfig } from '../types';
import Advanced from './forms/Advanced';
import ColorFont from './forms/ColorFont';
import CustomDomain from './forms/CustomDomain';
import StyleSheet from './forms/StyleSheet';

type Props = {
  configType: string;
  defaultConfigValues?: ClientPortalConfig;
  handleUpdate: (doc: ClientPortalConfig) => void;
};

const isUrl = (value: string): boolean => {
  try {
    return Boolean(new URL(value));
  } catch (e) {
    return false;
  }
};

function Form({ defaultConfigValues = {}, handleUpdate, configType }: Props) {
  const styles = defaultConfigValues.styles || {};
  const advanced = defaultConfigValues.advanced || {};

  const [formValues, setFormValues] = useState<ClientPortalConfig>({
    name: defaultConfigValues.name || '',
    description: defaultConfigValues.description || '',
    icon: defaultConfigValues.icon || '',
    logo: defaultConfigValues.logo || '',
    url: defaultConfigValues.url || '',
    knowledgeBaseLabel: defaultConfigValues.knowledgeBaseLabel || '',
    knowledgeBaseTopicId: defaultConfigValues.knowledgeBaseTopicId || '',
    ticketLabel: defaultConfigValues.ticketLabel || '',
    taskLabel: defaultConfigValues.taskLabel || '',
    taskPublicBoardId: defaultConfigValues.taskPublicBoardId || '',
    taskPublicPipelineId: defaultConfigValues.taskPublicPipelineId || '',
    taskStageId: defaultConfigValues.taskStageId || '',
    taskBoardId: defaultConfigValues.taskBoardId || '',
    taskPipelineId: defaultConfigValues.taskPipelineId || '',
    ticketStageId: defaultConfigValues.ticketStageId || '',
    ticketBoardId: defaultConfigValues.ticketBoardId || '',
    ticketPipelineId: defaultConfigValues.ticketPipelineId || '',
    domain: defaultConfigValues.domain || '',
    styles: {
      bodyColor: styles.bodyColor || '',
      headerColor: styles.headerColor || '',
      footerColor: styles.footerColor || '',
      helpColor: styles.helpColor || '',
      backgroundColor: styles.backgroundColor || '',
      activeTabColor: styles.activeTabColor || '',
      baseColor: styles.baseColor || '',
      headingColor: styles.headingColor || '',
      baseFont: styles.baseFont || '',
      headingFont: styles.headingFont || '',
      linkColor: styles.linkColor || '',
      linkHoverColor: styles.linkHoverColor || '',
      primaryBtnColor: styles.primaryBtnColor || '',
      secondaryBtnColor: styles.secondaryBtnColor || '',
      dividerColor: styles.dividerColor || ''
    },
    advanced: {
      authAllow: advanced.authAllow || '',
      viewTicket: advanced.viewTicket || '',
      permission: advanced.permission || ''
    },
    css: defaultConfigValues.css || '',
    mobileResponsive: defaultConfigValues.mobileResponsive || false
  });

  const handleFormChange = (name: string, value: string | object) => {
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!formValues.knowledgeBaseTopicId) {
      return Alert.error('Please choose a Knowledge base topic');
    }

    if (formValues.url && !isUrl(formValues.url)) {
      return Alert.error('Please enter a valid URL');
    }

    if (formValues.domain && !isUrl(formValues.domain)) {
      return Alert.error('Please enter a valid domain');
    }

    if (!formValues.taskPublicPipelineId) {
      return Alert.error('Please select a public task pipeline');
    }

    handleUpdate(formValues);
  };

  function renderContent() {
    const commonProps = {
      ...formValues,
      handleFormChange
    };

    switch (configType) {
      case CONFIG_TYPES.GENERAL.VALUE:
        return <General {...commonProps} />;
      case CONFIG_TYPES.ADVANCED.VALUE:
        return <Advanced {...commonProps} />;
      case CONFIG_TYPES.CUSTOM_DOMAIN.VALUE:
        return (
          <CustomDomain
            {...commonProps}
            dnsStatus={defaultConfigValues.dnsStatus}
          />
        );
      case CONFIG_TYPES.COLOR_FONTS.VALUE:
        return <ColorFont {...commonProps} />;
      case CONFIG_TYPES.STYLE_SHEET.VALUE:
        return <StyleSheet {...commonProps} />;
      default:
        return null;
    }
  }

  function renderSubmit() {
    return (
      <Button btnStyle="success" type="submit">
        Submit
      </Button>
    );
  }

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        {renderContent()}
        {renderSubmit()}
      </form>
    </Wrapper>
  );
}

export default Form;
