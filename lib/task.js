const fg = require("fast-glob");
const path = require("path");
const { testFile } = require("./test");

async function examineTaskAchievement(task, cwd) {
  const { filePatterns, ignorePatterns, test: testExpressions } = task;

  const arrayOfFilepath = await fg(filePatterns, {
    cwd: cwd,
    ignore: [...ignorePatterns, ".refactoredrc"],
    dot: true,
  });

  const done = [];
  const undone = [];

  for (const filepath of arrayOfFilepath) {
    // filepath starts after cwd.
    // we need to prepand cwd to read that file.
    const actualPath = path.join(cwd, filepath);

    if (await testFile(testExpressions, actualPath)) {
      done.push(filepath);
    } else {
      undone.push(filepath);
    }
  }

  return {
    done,
    undone,
  };
}

exports.examineTaskAchievement = examineTaskAchievement;
