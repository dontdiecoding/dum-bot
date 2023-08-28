import chalk from "chalk";

export const error_log = (msg: string) => {
    console.log(`${chalk.redBright(`error`)} ${msg}`);
};

export const info_log = (msg: string) => {
    console.log(`${chalk.cyanBright(`info`)} ${msg}`);
};

export const warn_log = (msg: string) => {
    console.log(`${chalk.yellowBright(`warn`)} ${msg}`);
};

export const success_log = (msg: string) => {
    console.log(`${chalk.greenBright(`success`)} ${msg}`);
};


export const debug_log = (msg: string) => {
    console.log(`${chalk.gray(`debug`)} ${msg}`);
};
