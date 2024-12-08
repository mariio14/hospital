import { init } from "./appFetch";
import * as userService from "./userService";
import * as planningService from "./planningService";

export { default as NetworkError } from "./NetworkError";


const backend = {
  init,
  userService,
  planningService
};

export default backend;
