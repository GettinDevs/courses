import { post, get } from "./Api";

type ActivityProps = {
  activityId?: number;
  description: string;
  params: string[];
  tests: [any[], any][];
};

export const getActivities = () => get("/activities");
export const addActivity = (activity: ActivityProps) =>
  post("/activities", activity);
export const updateActivity = (activity: ActivityProps) =>
  post("/activities", activity);
