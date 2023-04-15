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

  const [activeTab, setActiveTab] = useState<Tab>(items[0]);

  const handleClick = (tab: Tab) => () => setActiveTab(tab);

  return (
    <>
      <TabsContainer>
        {items.map((item) => (
          <Tab active={activeTab.label === item.label} key={item.label}>
            <button onClick={handleClick(item)}>{item.label}</button>
          </Tab>
        ))}
      </TabsContainer>
      <TabContent>
        <activeTab.Component />
      </TabContent>
    </>
  );
};

export default Tabs;

const TabsContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding-left: 0;
  margin-block-end: 0;
  list-style: none;
  border-bottom: 1px solid #2f2f2f;
  margin: 0;
`;
const Tab = styled.li<{ active?: boolean }>`
  margin-bottom: -1px;

  > button {
    border-radius: 0.25rem 0.25rem 0 0;
    border-color: #121212 #121212 #2f2f2f;
    background-color: #121212;

    &:hover {
      border-color: #2f2f2f #2f2f2f #2f2f2f;
    }

    ${(props) =>
      props.active
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
  padding: 40px;
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
