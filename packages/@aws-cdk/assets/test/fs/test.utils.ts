import fs = require('fs');
import { Test } from 'nodeunit';
import path = require('path');
import { ImportMock } from 'ts-mock-imports';
import { FollowMode } from '../../lib/fs';
import util = require('../../lib/fs/utils');

export = {
  shouldExclude: {
    'excludes nothing by default'(test: Test) {
      test.ok(!util.shouldExclude([], path.join('some', 'file', 'path')));
      test.done();
    },

    'excludes requested files'(test: Test) {
      const exclusions = ['*.ignored'];
      test.ok(util.shouldExclude(exclusions, path.join('some', 'file.ignored')));
      test.ok(!util.shouldExclude(exclusions, path.join('some', 'important', 'file')));
      test.done();
    },

    'does not exclude whitelisted files'(test: Test) {
      const exclusions = ['*.ignored', '!important.*'];
      test.ok(!util.shouldExclude(exclusions, path.join('some', 'important.ignored')));
      test.done();
    },
  },

  shouldFollow: {
    always: {
      'follows internal'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join(sourceRoot, 'referent');

        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', true);
        try {
          test.ok(util.shouldFollow(FollowMode.Always, sourceRoot, linkTarget));
          test.ok(mockFsExists.calledOnceWith(linkTarget));
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },

      'follows external'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join('alternate', 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', true);
        try {
          test.ok(util.shouldFollow(FollowMode.Always, sourceRoot, linkTarget));
          test.ok(mockFsExists.calledOnceWith(linkTarget));
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },

      'does not follow internal when the referent does not exist'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join(sourceRoot, 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', false);
        try {
          test.ok(!util.shouldFollow(FollowMode.Always, sourceRoot, linkTarget));
          test.ok(mockFsExists.calledOnceWith(linkTarget));
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },

      'does not follow external when the referent does not exist'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join('alternate', 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', false);
        try {
          test.ok(!util.shouldFollow(FollowMode.Always, sourceRoot, linkTarget));
          test.ok(mockFsExists.calledOnceWith(linkTarget));
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },
    },

    external: {
      'does not follow internal'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join(sourceRoot, 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync');
        try {
          test.ok(!util.shouldFollow(FollowMode.External, sourceRoot, linkTarget));
          test.ok(mockFsExists.notCalled);
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },

      'follows external'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join('alternate', 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', true);
        try {
          test.ok(util.shouldFollow(FollowMode.External, sourceRoot, linkTarget));
          test.ok(mockFsExists.calledOnceWith(linkTarget));
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },

      'does not follow external when referent does not exist'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join('alternate', 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', false);
        try {
          test.ok(!util.shouldFollow(FollowMode.External, sourceRoot, linkTarget));
          test.ok(mockFsExists.calledOnceWith(linkTarget));
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },
    },

    blockExternal: {
      'follows internal'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join(sourceRoot, 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', true);
        try {
          test.ok(util.shouldFollow(FollowMode.BlockExternal, sourceRoot, linkTarget));
          test.ok(mockFsExists.calledOnceWith(linkTarget));
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },

      'does not follow internal when referent does not exist'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join(sourceRoot, 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', false);
        try {
          test.ok(!util.shouldFollow(FollowMode.BlockExternal, sourceRoot, linkTarget));
          test.ok(mockFsExists.calledOnceWith(linkTarget));
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },

      'does not follow external'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join('alternate', 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync');
        try {
          test.ok(!util.shouldFollow(FollowMode.BlockExternal, sourceRoot, linkTarget));
          test.ok(mockFsExists.notCalled);
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },
    },

    never: {
      'does not follow internal'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join(sourceRoot, 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync');
        try {
          test.ok(!util.shouldFollow(FollowMode.Never, sourceRoot, linkTarget));
          test.ok(mockFsExists.notCalled);
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },

      'does not follow external'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join('alternate', 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync');
        try {
          test.ok(!util.shouldFollow(FollowMode.Never, sourceRoot, linkTarget));
          test.ok(mockFsExists.notCalled);
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },
    }
  },
};
