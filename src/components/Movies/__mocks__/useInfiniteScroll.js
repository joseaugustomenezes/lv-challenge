import { useRef } from 'react';

const useInfiniteScrollMock = () => {
  const loader = useRef(null);

  return { loader };
};

export default useInfiniteScrollMock;
