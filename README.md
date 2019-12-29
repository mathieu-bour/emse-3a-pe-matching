# PE Matching

Match a set of group of students with a set of projects.
Developed by Mathieu Bour <mathieu@mathrix.fr> in December 2019.

There are 9 groups and 11 projects.

## Usage

Run the solver:
```bash
npm run main
```

## Definition
### Rank table
The data is directly exported from a Google Sheets document.
Therefore, we have only two CSVs: projects and groups.

We can then parse the sheets to get a matrix called **rank table**
where:
- the lines are the groups
- the columns are the projects

A cell `R[i][j]` is the rank of the project `j` made by the group `i`.

### Combination
A **combination** is an array of length 9 of numbers between `1` and
`11`.
Given a combination `c`, `c[i]` is the project associated with the
group `i`.

A combination is **valid** if and only if there are no duplicated items,
e.g. `c[i] = c[j] => i = j`.

A combination `c` **violates** the threshold `n` for the rank table `R`
if there a `g` like `c[g] > R[g][c[g]]`.

## Objectives
### Lowest maximum rank
The first objective is to minimize the threshold `n` while keeping valid
combinations.

### Best score
Given a valid, non-violating combination `c`, the score `S(c)` of `c` is
defined by the sum of `R[g][c[g]]` for all `g`.
