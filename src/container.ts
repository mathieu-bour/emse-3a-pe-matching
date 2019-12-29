import { Group } from './entities/group';
import { Project } from './entities/project';

export class Container {
  static projects: Project[] = [];
  static groups: Group[] = [];

  static getProjectIdFromName(name: string): number {
    for (let i = 0; i < this.projects.length; i++) {
      if (this.projects[i].name === name) {
        return this.projects[i].id;
      }
    }

    console.error(`Project ${name} was not found`);
    return null;
  }
}
