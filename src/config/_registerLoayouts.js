
import {upperFirst,camelCase} from "lodash";


export default {
    install(app) {
        const layouts = import.meta.glob('@/views/layouts/*.vue', {eager: true});

        Object.entries(layouts).forEach(([path, module]) => {
            const componentName = upperFirst(
                camelCase(
                    path
                        .split("/")
                        .pop()
                        .replace(/\.\w+$/, "")
                )
            );
            //console.log(path, componentName);

            // export default
            app.component(`${componentName}`, module.default);
        });
    }
}