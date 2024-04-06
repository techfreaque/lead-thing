import classes from './ContentContainer.module.css';


export default function ContentContainer({ children }: { children: any }) {
  return <main className={classes.main}>{children}</main>;
}
