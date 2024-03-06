import React, { Key, useContext } from 'react';
import { ReactNode, CSSProperties } from 'react';
import { EventPathContext } from '../../context/EventPathContext';
import { JSONValue, ObjectStructure } from './utils';

interface UniqueStructuresProps {
  src: ObjectStructure;
}
const UniqueStructures = (props: UniqueStructuresProps) => {
  const { src } = props;
  const brackets = (value: JSONValue) => (Array.isArray(value) ? ['[', ']'] : ['{', '}']);

  const eventTrackerContext = useContext(EventPathContext);
  if (!eventTrackerContext) {
    throw new Error('ChildComponent must be used within an EventTracker');
  }
  const { registerPath, setPropagationFinished } = eventTrackerContext;

  const handleEventCapture = (currentTarget: EventTarget & HTMLElement, key: string) => {
    if (currentTarget.localName === 'ul') setPropagationFinished();
    else registerPath(key);
  };

  function format(i: unknown): ReactNode {
    switch (true) {
      case typeof i === 'string':
        return i as ReactNode;
      default:
        return i as ReactNode;
    }
  }

  const getType = (value: unknown) => {
    return 'string';
  };

  const renderNestedObject = (obj: ObjectStructure, opt?: { value?: JSONValue; style?: CSSProperties }): ReactNode => {
    return Object.entries(obj).map(([key, value]) => {
      if (value === null) {
        console.error('UniqueStructures::null', key);
        return null;
      }

      const isObject = typeof value === 'object';
      const isArray = Array.isArray(value);

      const KeyElement = () =>
        Array.isArray(opt?.value) ? (
          (opt?.value.length || 0) > 1 ? (
            <span style={{ marginInlineStart: '-2em' }}> | </span>
          ) : (
            <></>
          )
        ) : key ? (
          <>
            <strong className="_jsonKey">"{key}"</strong>
            <span className="_jsonSep">: </span>
          </>
        ) : (
          <></>
        );

      const RootElement: React.FC<
        React.HTMLAttributes<HTMLLIElement> & { key?: Key; ['data-key']: string; ['data-is-array']?: boolean }
      > = ({ children, ...props }) =>
        opt?.style?.display === 'contents' ? (
          <React.Fragment key={props.key}>{children}</React.Fragment>
        ) : (
          <li
            {...props}
            onClick={(e) => {
              handleEventCapture(e.currentTarget, props['data-key']);
            }}
          >
            {children}
          </li>
        );

      return isArray ? (
        <RootElement key={key} data-key={key} data-is-object data-is-array>
          <KeyElement />
          {value.length > 1 ? (
            <pre style={{ marginBlock: 'initial', display: 'inline' }}>
              (
              <ul className="_jsonList" style={{ paddingInlineStart: '2em' }}>
                {value.map((v) => renderNestedObject({ ['']: v }, { value, style: { display: 'block' } }))}
              </ul>
              )[]
            </pre>
          ) : (
            <>{renderNestedObject({ ['']: value[0] }, { value, style: { display: 'contents' } })}[]</>
          )}
        </RootElement>
      ) : isObject ? (
        <RootElement key={key} data-key={key} data-is-object style={opt?.style}>
          <KeyElement />
          <pre style={{ marginBlock: 'initial', display: 'inline' }}>
            {brackets(value)[0]}
            <ul className="_jsonList" style={{ paddingInlineStart: '1em' }}>
              {renderNestedObject(value)}
            </ul>
            {brackets(value)[1]}
          </pre>
        </RootElement>
      ) : (
        <RootElement key={key} data-key={key} style={opt?.style}>
          <KeyElement />
          <span className={`_jsonVal ${getType(value)}`}>{format(value)}</span>
        </RootElement>
      );
    });
  };

  // root
  return (
    <pre style={{ marginBlock: 'initial', display: 'inline' }}>
      {brackets(src)[0]}
      <ul
        className="_jsonList"
        style={{ paddingInlineStart: '1em' }}
        onClick={(e) => {
          handleEventCapture(e.currentTarget, '');
        }}
      >
        {renderNestedObject(src)}
      </ul>
      {brackets(src)[1]}
    </pre>
  );
};

export default UniqueStructures;
