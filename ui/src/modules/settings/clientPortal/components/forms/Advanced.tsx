import Button from 'erxes-ui/lib/components/Button';
import FormGroup from 'erxes-ui/lib/components/form/Group';
import ControlLabel from 'erxes-ui/lib/components/form/Label';
import { FlexContent } from 'erxes-ui/lib/layout/styles';
import React, { useState } from 'react';
import { Circle } from '../../styles';
import { AdvancedSettings } from '../../types';

type Props = {
  handleFormChange: (name: string, value: string | object) => void;
  advanced?: AdvancedSettings;
};

type Item = {
  name: string;
  value: string;
  label: string;
};

function Advanced({ advanced = {}, handleFormChange }: Props) {
  const { authAllow, viewTicket, permission } = advanced;

  const [toggle, setToggle] = useState<{
    authAllow?: string;
    viewTicket?: string;
    permission?: string;
  }>({
    authAllow,
    viewTicket,
    permission
  });

  function renderControl({ label, name, value }: Item) {
    const handleClick = () => {
      const currentConfig = { ...advanced };

      currentConfig[name] = value;

      handleFormChange('advanced', currentConfig);

      setToggle({ ...toggle, [name]: value });
    };

    return (
      <FormGroup>
        <Button btnStyle="link" onClick={handleClick}>
          <Circle active={toggle[name] === value} />
          {label}
        </Button>
      </FormGroup>
    );
  }

  function renderContent(
    title: string,
    desciption: string,
    content: JSX.Element
  ) {
    return (
      <FormGroup>
        <h2>{title}</h2>
        <ControlLabel>{desciption}</ControlLabel>
        {content}
      </FormGroup>
    );
  }

  return (
    <>
      {renderContent(
        'User Sign Up and Login',
        'Allow users to Sign Up from the customer portal',
        <FlexContent>
          {renderControl({
            name: 'authAllow',
            label: 'Yes',
            value: 'yes'
          })}
          {renderControl({
            name: 'authAllow',
            label: 'No',
            value: 'no'
          })}
          {renderControl({
            name: 'authAllow',
            label: 'Connect your databse',
            value: 'connectDb'
          })}
        </FlexContent>
      )}
      {renderContent(
        'User Permissions for portal',
        'Who can submit a new ticket on portal',
        <FlexContent>
          {renderControl({
            name: 'permission',
            label: 'Logged in users',
            value: 'loggedInUsers'
          })}
          {renderControl({
            name: 'permission',
            label: 'Everyone',
            value: 'everyone'
          })}
        </FlexContent>
      )}
      {renderContent(
        '',
        'Who can view tickets on portal',
        <FlexContent>
          {renderControl({
            name: 'viewTicket',
            label: 'Logged in Users',
            value: 'loggedInUsers'
          })}
          {renderControl({
            name: 'viewTicket',
            label: 'Anyone with a public ticket URL',
            value: 'anyonePublicURL'
          })}
        </FlexContent>
      )}
    </>
  );
}

export default Advanced;
