"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
exports.loadConfig = () => {
    const conda_version = core.getInput('conda-version', {
        required: true
    });
    const python_version = core.getInput('python-version', {
        required: true
    });
    const os = process.platform;
    return {
        conda_version: conda_version,
        python_version: python_version,
        os: os
    };
};
