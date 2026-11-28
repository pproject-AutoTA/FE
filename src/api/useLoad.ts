import { useEffect, useState, type DependencyList } from "react";

/**
 * 화면이 열릴 때 서버에서 데이터를 한 번 불러온다. deps가 바뀌면 다시 불러온다.
 * 다시 불러오는 동안에는 이전 데이터를 그대로 두어 화면이 깜빡이지 않는다.
 */
export function useLoad<T>(load: () => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<{
    data: T | null;
    error: unknown;
    loading: boolean;
  }>({ data: null, error: null, loading: true });

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    load()
      .then((data) => alive && setState({ data, error: null, loading: false }))
      .catch((error) => alive && setState({ data: null, error, loading: false }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
