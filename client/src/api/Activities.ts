import { post, get } from './Api';

type ActivityProps = {
  description: string;
  params: string[];
  tests: [any[], any][];
}

export const getActivities = () => get('/activities')
export const addActivity = (activity: ActivityProps) => post('/activities', activity)
