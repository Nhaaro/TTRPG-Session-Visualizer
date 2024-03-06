import styled from 'styled-components';
import { LogsSection, SessionsSection, StructuresSection, ValuesSection } from '.';

const Modules = () => {
  return (
    <Grid>
      <LogsSection />
      <SessionsSection />
      <StructuresSection />
      <ValuesSection />
    </Grid>
  );
};

export default Modules;

const Grid = styled.div`
  display: grid;
  grid-template-columns: max-content max-content max-content max-content max-content;
  grid-template-rows: 1fr;
  grid-gap: 0.5rem 20px;
  grid-auto-flow: row;
  grid-template-areas:
    'logs sessions structures values'
    'logs sessions structures values';
  flex: 1;
  overflow-y: hidden;
`;
