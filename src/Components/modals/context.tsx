import React, {
  useState,
  useContext,
  createContext,
  useCallback,
  useRef,
  useEffect,
} from 'react';

import Loading from './Loading';

import ConfirmDelete from './ConfirmDelete';

type ModalsType = {
  openLoading: (message: string) => void;
  closeLoading: () => void;
  confirmDelete: (descr: string, fn: () => void) => void;
};

const notImplemented = () => {
  throw new Error('Popup Context not ready yet');
};

const initialValue = {
  openLoading: notImplemented,
  closeLoading: notImplemented,
  confirmDelete: notImplemented,
};

export const ModalsContext = createContext<ModalsType>(initialValue);

export const ModalsProvider: React.FC<{}> = ({ children }) => {
  const [t, setLoading] = useState<string | undefined>(undefined);
  const ctx = useRef<ModalsType>(initialValue);

  const [delParams, setDelParams] = useState<{
    descr?: string;
    fn?: () => void;
  }>({});

  useEffect(() => {
    ctx.current.confirmDelete = (descr: string, fn: () => void): void =>
      setDelParams({ descr, fn });
  }, [setDelParams]);

  useEffect(() => {
    ctx.current.closeLoading = () => setLoading(undefined);
    ctx.current.openLoading = setLoading;
  }, [setLoading]);

  const onCloseConfirmDelete = useCallback(
    (result: boolean) => {
      setDelParams({});
      if (result && delParams.fn) delParams.fn();
    },
    [setDelParams, delParams]
  );

  ctx.current.closeLoading = useCallback(() => setLoading(undefined), [
    setLoading,
  ]);

  return (
    <ModalsContext.Provider value={ctx.current}>
      <Loading isOpen={!!t}>{t}</Loading>
      <ConfirmDelete descr={delParams.descr} onClose={onCloseConfirmDelete} />
      {children}
    </ModalsContext.Provider>
  );
};

export function useModals() {
  return useContext(ModalsContext);
}
