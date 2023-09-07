import chalk from "chalk";

export const info_log = (msg: string) => {
    console.log(`${chalk.cyan(`info`)} ${msg}`);
};

export const error_log = (msg: string) => {
    console.log(`${chalk.red(`error`)} ${msg}`);
};

export const format_str = (msg: string) => {
    return msg.split(" ").map((m) => {
        return m.charAt(0).toUpperCase() + m.slice(1).toLowerCase();
    }).join(" ")
};
