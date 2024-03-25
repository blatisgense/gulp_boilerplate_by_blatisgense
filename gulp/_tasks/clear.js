import del from "del";
import { paths } from "../_helpers/paths.js";

export const taskClear = () => del(paths.root, {force: true});
