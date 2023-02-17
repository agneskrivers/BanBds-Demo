import initial from '../initial';

// Enums
import { LengthID } from '@server/enums';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { ProjectsModel } from '@server/models';

// Interfaces
import type { IServerGenerateID } from '@interfaces';

const Index: IServerGenerateID = async () => {
    try {
        const projects = await ProjectsModel.find();

        if (projects.length === 0) return initial(LengthID.project);

        const project = projects[projects.length - 1].toObject();

        return project.projectID + 1;
    } catch (error) {
        const { message } = error as Error;

        handleError('Server Helper Generate Project ID', message);

        return null;
    }
};

export default Index;
