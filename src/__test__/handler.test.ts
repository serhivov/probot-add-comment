import { handle } from "../handler";
import { IComment } from "../models";
import { FakeContext } from "./fakecontext";
import { FakeGithub } from "./fakegithub";

it("adds a comment when the label has been added to the issue", () => {
  expect.assertions(2);
  const github = new FakeGithub([]);
  const context = new FakeContext(
    { label: { name: "test" }, action: "labeled" },
    github,
    {}
  );
  const commentBody = "this is a test comment";
  const comments: IComment[] = [{ label: "test", comment: commentBody }];

  return handle(context, comments).then((resp) => {
    expect(github.commentsAdded).toEqual([commentBody]);
    expect(github.comments).toEqual([commentBody]);
  });
});

it("doesnt add a comment when the label doesn't match", () => {
  expect.assertions(2);
  const github = new FakeGithub([]);
  const context = new FakeContext(
    { label: { name: "this" }, action: "labeled" },
    github,
    {}
  );
  const commentBody = "this is a test comment";
  const comments: IComment[] = [{ label: "test", comment: commentBody }];

  return handle(context, comments).then((resp) => {
    expect(github.commentsAdded).toEqual([]);
    expect(github.comments).toEqual([]);
  });
});

it("doesn't add a comment when the comment already exists on the issue", () => {
  expect.assertions(2);
  const commentBody = "this is a test comment";
  const github = new FakeGithub([commentBody, "new comment"]);
  const context = new FakeContext(
    { label: { name: "this" }, action: "labeled" },
    github,
    {}
  );
  const comments: IComment[] = [{ label: "this", comment: commentBody }];

  return handle(context, comments).then((resp) => {
    expect(github.commentsAdded).toEqual([]);
    expect(github.comments).toEqual([commentBody, "new comment"]);
  });
});

it("removes a comment when the label is removed", () => {
  expect.assertions(2);
  const commentBody = "this is a test comment";
  const github = new FakeGithub([commentBody]);
  const context = new FakeContext(
    { label: { name: "test" }, action: "unlabeled" },
    github,
    {}
  );
  const comments: IComment[] = [{ label: "test", comment: commentBody }];

  return handle(context, comments).then((resp) => {
    expect(github.commentsAdded).toEqual([]);
    expect(github.commentsRemoved).toEqual([commentBody]);
  });
});

it("doesn't remove a comment when the label doesn't match", () => {
  expect.assertions(2);
  const commentBody = "this is a test comment";
  const github = new FakeGithub([commentBody]);
  const context = new FakeContext(
    { label: { name: "this" }, action: "unlabeled" },
    github,
    {}
  );
  const comments: IComment[] = [{ label: "test", comment: commentBody }];

  return handle(context, comments).then((resp) => {
    expect(github.commentsAdded).toEqual([]);
    expect(github.commentsRemoved).toEqual([]);
  });
});
