import { init } from "./appFetch";
import * as userService from "./userService";

export { default as NetworkError } from "./NetworkError";


const backend = {
  init,
  userService
};

export default backend;
