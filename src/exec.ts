// A typed wrapper around exec

const { exec } = require('child-process-async');

type Output = {
  stdout: string,
  stderr: string
}

const newExec = async (command: string) => {
  const { stdout, stderr } = await exec(command);

  const output: Output = {
    stdout,
    stderr
  }

  return output;
}

export default newExec;
