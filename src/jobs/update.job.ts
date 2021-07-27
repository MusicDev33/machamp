const { exec } = require('child-process-async');

export const updateSysDeps = async (msg: string) => {
  const { stdout, stderr } = await exec('apt update && apt upgrade && apt autoremove');

  console.log(stdout);
}
