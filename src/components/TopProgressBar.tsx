import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

export function TopProgressBar() {
  useEffect(() => {
    // NProgress.start();
    return () => {
      NProgress.done();
    };
  }, []);
  
  return null;
}
