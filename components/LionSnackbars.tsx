import { atom, getDefaultStore, useAtom } from 'jotai';
import { ReactNode } from 'react';
import { Portal, Snackbar, SnackbarProps } from 'react-native-paper';
import LionText from './LionText';

export type SnackbarData = Omit<SnackbarProps, 'children' | 'visible' | 'onDismiss'> & {
  /** Mode of the snackbar. Determines appearance. Defaults to 'default'. */
  mode?: 'default' | 'info' | 'warn' | 'success' | 'error';
  /** Title of the snackbar. */
  title?: ReactNode;
  content: ReactNode;
  onDismiss?: SnackbarProps['onDismiss'];
}

let nextId = 0;
const snackbarsAtom = atom<SnackbarData[]>([]);

export default function LionSnackbars() {
  const [snackbars, setSnackbars] = useAtom(snackbarsAtom);

  return (
    <Portal>
      {snackbars.map(self => {
        // TODO: actually style this shit
        const { id, mode, content, onDismiss, ...props } = self;
        return (
          <Snackbar
            key={id}
            visible
            onDismiss={() => {
              setSnackbars((curr) => curr.filter(s => s !== self));
              onDismiss?.();
            }}
            {...props}
          >
            {typeof content !== 'object' ? (
              <LionText>{content}</LionText>
            ) : content}
          </Snackbar>
        );
      })}
    </Portal>
  );
}

export function snackbar(props: SnackbarData) {
  const data: any = {
    ...props,
    id: nextId++,
  };
  getDefaultStore().set(snackbarsAtom, (curr) => [...curr, data]);
}
