import { init } from "./appFetch";
import * as userService from "./userService";
import * as planningService from "./planningService";
import * as prioritiesService from "./prioritiesService";
import * as staffService from "./staffService";

export { default as NetworkError } from "./NetworkError";


const backend = {
  init,
  userService,
  planningService,
  prioritiesService,
  staffService
};

export default backend;
