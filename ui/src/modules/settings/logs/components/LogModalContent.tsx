import dayjs from 'dayjs';
import Icon from 'modules/common/components/Icon';
import TextInfo from 'modules/common/components/TextInfo';
import colors from 'modules/common/styles/colors';
import React from 'react';
import { LogBox } from '../styles';
import { ILog, ILogDesc } from '../types';
import { flattenObject, isObjectEmpty } from '../utils';

// field names used to show properly formatted date values
const DATE_FIELD_NAMES = [
  'createdAt',
  'createdDate',
  'modifiedAt',
  'lastSeenAt',
  'closeDate',
  'modifiedDate'
];

type Props = {
  log: ILog;
  schemaLabelMaps: ILogDesc[];
};

export default class Log extends React.Component<Props> {
  private extraDesc: any[] = [];

  constructor(props: Props) {
    super(props);

    this.extraDesc = JSON.parse(props.log.extraDesc || '[]') || [];
  }

  /**
   * Builds an html list from given array
   * @param {Object|string|number[]]} array List of values
   * @param {string} name Field name at database
   */
  buildListFromArray(array: any[] = [], name: string = ''): JSX.Element {
    const list: JSX.Element[] = [];

    array.forEach((elem, index) => {
      if (typeof elem !== 'object') {
        let value: string = elem.toString();

        // Finding mapped name behind id field
        if (this.extraDesc) {
          const found: ILogDesc = this.extraDesc.find(
            item => item[name] === value
          );
          if (found) {
            value = found.name;
          }
        }

        list.push(<li key={Math.random()}>{value}</li>);
      }

      if (typeof elem === 'object') {
        const sub: JSX.Element[] = this.buildListFromObject(elem);

        list.push(<li key={Math.random()}>{index + 1}:</li>);
        list.push(<ul key={Math.random()}>{sub}</ul>);
        // list.push(<li className="modal-li" key={Math.random()}>{sub}({index + 1})</li>);
      }
    });

    if (list.length > 0) {
      return <ul key={Math.random()}>{list}</ul>;
    }

    return <ul key="array" />;
  }

  buildListFromObject(obj = {}): JSX.Element[] {
    const { schemaLabelMaps } = this.props;

    const flatObject: object = flattenObject(obj);
    const names: string[] = flatObject
      ? Object.getOwnPropertyNames(flatObject).sort()
      : [];
    const list: JSX.Element[] = [];

    if (isObjectEmpty(flatObject)) {
      return [<span key={'empty-object'} />];
    }

    for (const name of names) {
      const field: any = flatObject[name];
      const mappedItem: ILogDesc | undefined = schemaLabelMaps.find(
        fn => fn.name === name
      );

      if (!mappedItem) {
        continue;
      }

      const label: string = mappedItem.label;
      let value: string = String(field);

      if (DATE_FIELD_NAMES.includes(name)) {
        value = dayjs(field).format('YYYY-MM-DD HH:mm');
      }

      if (this.extraDesc) {
        const found: ILogDesc = this.extraDesc.find(
          fieldItem => fieldItem[name] === value
        );

        if (found) {
          value = found.name;
        }
      }

      let item: JSX.Element = (
        <div key={name}>
          <span className="field-name">{label}:</span>
          <span className="field-value">
            <div dangerouslySetInnerHTML={{ __html: value }} />
          </span>
        </div>
      );

      if (typeof field === 'object') {
        if (Array.isArray(field)) {
          item = this.buildListFromArray(field, name);
          // console.log(field, name)
          list.push(
            <div className="field-name" key={Math.random()}>
              {label}:
            </div>
          );

          list.push(item);
        } else {
          const sub = this.buildListFromObject(field);

          item = <li key={Math.random()}>{name}:</li>;

          list.push(
            <div className="field-name" key={Math.random()}>
              {label}:
            </div>
          );

          list.push(<li key={Math.random()}>{sub}</li>);
        }
      } else {
        // primary types
        list.push(item);
      }
    } // end for loop

    return list;
  }

  /**
   * Reads a stringified json and builds a list using its attributes.
   * @param {string} jsonString A stringified JSON object
   */
  prettyJSON(jsonString: string): JSX.Element {
    if (!jsonString) {
      return <span />;
    }

    const clean = jsonString.replace('\n', '');
    const parsed = JSON.parse(clean);

    if (isObjectEmpty(parsed)) {
      return <span />;
    }

    if (typeof parsed === 'object' && !Array.isArray(parsed)) {
      return <div>{this.buildListFromObject(parsed)}</div>;
    }

    if (Array.isArray(parsed)) {
      return <div>{this.buildListFromArray(parsed)}</div>;
    }

    return <span />;
  }

  renderData(
    data: string,
    label: string,
    cls: string,
    iconType: string
  ): JSX.Element {
    if (!data) {
      return <span />;
    }

    let color: string = colors.colorPrimary;

    switch (cls) {
      case 'success':
        color = colors.colorCoreGreen;
        break;
      case 'warning':
        color = colors.colorCoreYellow;
        break;
      case 'danger':
        color = colors.colorCoreRed;
        break;
      default:
        break;
    }

    return (
      // <Col sm={6}>
      <LogBox color={color}>
        <div>
          <span className="icon">
            <Icon icon={iconType} size={15} color={color} />
          </span>
          <TextInfo textStyle={cls} hugeness="big">
            {label}
          </TextInfo>
        </div>
        <div className="field-all">{this.prettyJSON(data)}</div>
      </LogBox>
    );
  }

  render() {
    const { log } = this.props;

    console.log(log.removedData);

    if (!log) {
      return null;
    }

    return (
      <>
        <div className="modal-items-list">
          {log.oldData !== '{}' &&
            this.renderData(
              log.oldData,
              'Before any changes',
              'default',
              'history'
            )}
          {log.addedData !== '{}' &&
            this.renderData(log.addedData, 'Added fields', 'success', 'add')}
          {log.changedData !== '{}' &&
            this.renderData(
              log.changedData,
              'Changed fields',
              'warning',
              'edit'
            )}
          {log.removedData !== '{}' &&
            this.renderData(
              log.removedData,
              'Removed fields',
              'danger',
              'trash'
            )}
        </div>
      </>
    );
  }

  componentWillUnmount() {
    this.extraDesc = [];
  }
}
// style={{display: 'flex', flexWrap: 'wrap'}}
