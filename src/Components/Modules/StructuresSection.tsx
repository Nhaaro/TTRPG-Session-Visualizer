import { useContext } from 'react';
import styled from 'styled-components';
import UniqueStructures from './UniqueStructures';
import { ModuleContext } from '../../App';
import { useArrayIterator } from 'Utils/utils';
import { getStructure } from '.';

const structuresMap = ((globalThis as any).structuresMap = new Map<string, Set<unknown>>());

export const StructuresSection = () => {
  const messagesContext = useContext(ModuleContext);
  if (!messagesContext) {
    throw new Error('Unable to read messagesContext');
  }
  const { structures, setStructures, selectedModule } = messagesContext;
  useArrayIterator(
    { array: selectedModule.module, deps: [setStructures, selectedModule.module] as const },
    (index, value, [setStructures]) => {
      if ('$$deleted' in value) return;

      setStructures((structures) => {
        const objectStructure = getStructure(
          { key: '', value, parent: { location: '' }, structuresMap },
          !selectedModule.module[index + 1]
        );
        const stringifiedStructure = JSON.stringify(objectStructure.value as string);

        if (!structures.has(stringifiedStructure)) {
          return new Set([...structures, stringifiedStructure]);
        } else {
          return new Set([...structures]);
        }
      });
    },
    () => setStructures(new Set())
  );

  return (
    <Section>
      <ul>
        {[...structures.values()].map((obj, i) => (
          <li key={i}>
            <UniqueStructures src={JSON.parse(obj)} />
          </li>
        ))}
      </ul>
    </Section>
  );
};

const Section = styled.section`
  grid-area: structures;
  display: flex;
  flex-direction: column;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    flex: 1;
    overflow: scroll;
    padding-right: 0.8rem;

    li {
      &:hover {
        background-color: rgba(255, 255, 255, 0.04);
      }
      &.active {
        background-color: rgba(255, 255, 255, 0.08);
      }
    }
  }
`;
