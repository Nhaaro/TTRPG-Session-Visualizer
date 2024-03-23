import styled from 'styled-components';
import { MessagesSection, SessionsSection } from '.';

const Modules = () => {
  return (
    <Grid>
      <SessionsSection />
      <MessagesSection />
    </Grid>
  );
};

export default Modules;

const Grid = styled.div`
  display: grid;
  grid-template-columns: max-content max-content;
  grid-template-rows: 1fr;
  grid-gap: 0.5rem 20px;
  grid-auto-flow: row;
  grid-template-areas:
    'sessions messages'
    'sessions messages';
  flex: 1;
  overflow-y: hidden;
`;
