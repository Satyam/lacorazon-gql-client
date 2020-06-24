import '@testing-library/jest-dom/extend-expect';
import 'mutationobserver-shim';

const snapshotDiff = require('snapshot-diff');

expect.addSnapshotSerializer(snapshotDiff.getSnapshotDiffSerializer());

global.MutationObserver = global.window.MutationObserver;
