"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const exec = __importStar(require("@actions/exec"));
const io = __importStar(require("@actions/io"));
const tc = __importStar(require("@actions/tool-cache"));
function wait(milliseconds) {
    return new Promise(resolve => {
        if (isNaN(milliseconds)) {
            throw new Error('milleseconds not a number');
        }
        setTimeout(() => resolve('done!'), milliseconds);
    });
}
exports.wait = wait;
const condaInstructionsWin = {
    download_url: conda_version => `https://repo.anaconda.com/miniconda/Miniconda3-${conda_version}-Windows-x86_64.exe`,
    local_path: 'Miniconda3.exe',
    install_cmd: {
        command: 'start',
        options: [
            '/wait',
            '""',
            'Miniconda3.exe',
            '/InstallationType=JustMe',
            '/RegisterPython=0',
            '/S',
            '/D=%UserProfile%Miniconda3'
        ]
    }
};
const condaInstructionsOsX = {
    download_url: conda_version => `https://repo.anaconda.com/miniconda/Miniconda3-${conda_version}-Linux-x86_64.sh`,
    local_path: '~/miniconda.sh',
    install_cmd: {
        command: 'bash',
        options: ['~/miniconda.sh', '-b', '-p', '$HOME/miniconda']
    }
};
const condaInstructionsLinux = {
    download_url: conda_version => `https://repo.anaconda.com/miniconda/Miniconda3-${conda_version}-Linux-x86_64.sh`,
    local_path: '~/miniconda.sh',
    install_cmd: {
        command: 'bash',
        options: ['~/miniconda.sh', '-b', '-p', '$HOME/miniconda']
    }
};
exports.get_instructions = (config) => {
    if (config.os === 'win32') {
        return condaInstructionsWin;
    }
    else if (config.os === 'darwin') {
        return condaInstructionsOsX;
    }
    else {
        return condaInstructionsLinux;
    }
};
exports.download_miniconda = (config) => __awaiter(this, void 0, void 0, function* () {
    const instruction = exports.get_instructions(config);
    const download_url = instruction.download_url(config.conda_version);
    const minconda_download_path = yield tc.downloadTool(download_url);
    yield io.mv(minconda_download_path, instruction.local_path);
});
exports.install_conda = (config) => __awaiter(this, void 0, void 0, function* () {
    const instruction = exports.get_instructions(config);
    const command = instruction.install_cmd.command;
    const option = instruction.install_cmd.options;
    yield exec.exec(command, option);
});
