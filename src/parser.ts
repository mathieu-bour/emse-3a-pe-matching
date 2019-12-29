import * as parse from 'csv-parse/lib/sync';
import { readFileSync } from 'fs';
import { Container } from './container';
import { Group } from './entities/group';
import { Project } from './entities/project';

/**
 * Parse the CSV data
 */
export class Parser {
  static projects() {
    if (Container.projects.length > 0) {
      return;
    }

    const raw = readFileSync(__dirname + '/../data/projects.csv');
    const data = parse(raw, {
      from_line: 2, // ignore headers
      cast: true,
    });

    Container.projects = data.map(line => new Project(line[0], line[1]));
  }

  static groups() {
    if (Container.groups.length > 0) {
      return;
    }

    const raw = readFileSync(__dirname + '/../data/groups.csv');
    const data: any[] = parse(raw, {
      from_line: 2, // ignore headers
      cast: true,
      trim: true,
    });

    Container.groups = data.map((line: string[], id: number) => {
      const names = [
        line[1] + ' ' + line[2],
      ];

      if (line[4].length > 0 && line[5].length > 0) {
        names.push(line[4] + ' ' + line[5]);
      }

      const wishes = [];

      for (let i = 6; i <= 16; i++) {
        wishes.push(Container.getProjectIdFromName(line[i]));
      }

      return new Group(names, wishes);
    });
  }

  static getMatrix(): number[][] {
    Parser.projects();
    Parser.groups();

    const matrix = [];

    Container.groups.forEach(g => {
      const line = g.wishes.map(() => -1);
      g.wishes.forEach((val: number, rank: number) => {
        line[val - 1] = rank;
      });
      matrix.push(line);
    });

    return matrix;
  }
}
