import browserSync from "browser-sync";
import { paths } from "../_helpers/paths.js";

export const taskServer = () => {
    browserSync.init({
        server: {
            baseDir: paths.root,
            index: "index.html",
            port: 3038
        },
        ui: {
            port: 8080,
        },
    });
};
