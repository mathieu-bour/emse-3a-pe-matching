import { Container } from './container';
import { fromCombination, hasDuplicates, toCombination, violateThreshold } from './math';
import { Parser } from './parser';

export class Solver {
  private readonly COUNTER_PACE = 1000;
  private readonly LINES_LENGTH = 64;

  private matrix: number[][];
  private groups: number;
  private base: number;
  private max: number;

  private threshold = 0;
  private combinations: number[][] = [];
  private costsMap = new Map<number[], number>();

  solve() {
    this.data();
    this.extract();
    this.evaluate();
    this.display();
  }

  data() {
    console.table('Stage 0: Read data\n' + '='.repeat(this.LINES_LENGTH));
    this.matrix = Parser.getMatrix();
    this.groups = this.matrix.length;
    this.base = this.matrix[0].length;
    this.max = fromCombination(
      [...Array(this.groups)].map(() => this.base - 1),
      this.base,
    );
  }

  extract() {
    console.log('Stage 1: Extraction\n' + '='.repeat(this.LINES_LENGTH));

    do {
      this.threshold++;
      console.time(`extraction-${this.threshold}`);
      console.log('Trying to extract pairs with threshold of', this.threshold);

      // Reset
      let current = 0;
      let counter = 0;
      let chars = 0;
      let out = false;
      this.combinations = [];

      while (current < this.max) {
        const combination = toCombination(current, this.base, this.groups);

        counter++;
        if (counter === this.COUNTER_PACE) {
          out = true;
          process.stdout.write('.');
          counter = 0;
          chars++;

          if (chars === this.LINES_LENGTH) {
            process.stdout.write('\n');
            chars = 0;
          }
        }

        let violation = violateThreshold(this.matrix, combination, this.threshold);

        if (violation != null) {
          current += Math.pow(this.base, this.groups - violation - 1);
          continue;
        }

        if (hasDuplicates(combination)) {
          current++;
          continue;
        }

        current++;
        this.combinations.push(combination);
      }

      if (out) {
        process.stdout.write('\n');
      }

      console.timeEnd(`extraction-${this.threshold}`);

      if (this.combinations.length === 0) {
        console.log('No solutions found.');
      } else {
        console.log('Found', this.combinations.length, 'solutions found');
      }

      process.stdout.write('\n');
    } while (this.combinations.length === 0 && this.threshold <= this.base);
  }

  private cost(combination: number[]) {
    if (this.costsMap.has(combination)) {
      return this.costsMap.get(combination);
    } else {
      const cost = combination.reduce((carry: number, project: number, group: number) => {
        return carry + this.matrix[group][project];
      }, 0);

      this.costsMap.set(combination, cost);

      return cost;
    }
  }

  evaluate() {
    console.log('Stage 2: Evaluation\n' + '='.repeat(this.LINES_LENGTH));
    console.log('Best solutions are with threshold of', this.threshold);

    console.time('evaluation');
    this.combinations = this.combinations.sort((a, b) => {
      return this.cost(a) - this.cost(b);
    });
    console.timeEnd('evaluation');
  }

  display() {
    this.combinations.slice(0, 1).forEach(combination => {
      const table = combination.map((project, group) => {
        return {
          name: Container.groups[group].names.join(' & '),
          project_id: Container.projects[project].id,
          project: Container.projects[project].name,
          rank: this.matrix[group][project] + 1
        };
      });

      console.log('Score:', this.costsMap.get(combination));
      console.table(table);
    });
  }
}
