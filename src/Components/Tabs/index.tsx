import React, { useState } from 'react';
import styled, { css } from 'styled-components';

export type Tab = {
  label: string;
  Component: React.ComponentType;
};

interface TabsProps {
  items: Tab[];
}
const Tabs = (props: TabsProps) => {
  const { items } = props;

  const [activeTab, setActiveTab] = useState<number>(0);

  const handleClick = (index: number) => () => setActiveTab(index);

  const ActiveComponent = items[activeTab].Component;

  return (
    <>
      <TabList>
        {items.map((item, index) => (
          <TabListItem active={activeTab === index} key={item.label}>
            <button onClick={handleClick(index)}>{item.label}</button>
          </TabListItem>
        ))}
      </TabList>
      <TabContent>{ActiveComponent && <ActiveComponent />}</TabContent>
    </>
  );
};

export default Tabs;

const TabList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding-left: 0;
  margin-block-end: 0;
  list-style: none;
  border-bottom: 1px solid #2f2f2f;
  margin: 0;
`;
const TabListItem = styled.li<{ active: boolean }>`
  margin-bottom: -1px;

  > button {
    border-radius: 0.25rem 0.25rem 0 0;
    border-color: #121212 #121212 #2f2f2f;
    background-color: #121212;

    &:hover {
      border-color: #2f2f2f #2f2f2f #2f2f2f;
    }

    ${({ active }) =>
      active
        ? css`
            background-color: #1e1e1e;
            border-color: #2f2f2f #2f2f2f #1e1e1e;

            font-weight: bolder;

            &:hover {
              border-color: #2f2f2f #2f2f2f #1e1e1e;
            }
          `
        : css`
            background-color: #242424;
            border-color: #242424 #242424 #2f2f2f;
          `}
  }
`;
const TabContent = styled.div`
  margin-block-end: 10px;
  padding: 20px;
  border: 1px solid #2f2f2f;
  border-radius: 0 0 0.5rem 0.5rem;
  border-top: 0;

  background-color: #1e1e1e;
  flex: 1;
  margin: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
