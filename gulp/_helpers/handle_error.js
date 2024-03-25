import plumber from "gulp-plumber";
import notify from "gulp-notify";

export const handleError = (taskName) => plumber({errorHandler: notify.onError({title: taskName, message: 'Error: <%= error.message %>'})})
