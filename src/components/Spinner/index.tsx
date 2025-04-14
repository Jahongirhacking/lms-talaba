import Loading from '../Common/Loading';
import s from './Spinner.module.css';

export const Spinner = () => {
  return (
    <div className={s.SpinnerContainer}>
      <Loading />
    </div>
  );
};
