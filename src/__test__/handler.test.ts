import { handle } from "../handler";
import { IComment } from "../models";
import { FakeContext } from "./fakecontext";
import { FakeGithub } from "./fakegithub";

it("adds a comment when the label has been added to the issue", () => {
  expect.assertions(2);
  const github = new FakeGithub([]);
  const context = new FakeContext({ label: { name: "test" }, issue: { labels: [{ name: "test" }]}}, github, {});
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
  const context = new FakeContext({ label: { name: "this" }, issue: { labels: []}}, github, {});
  const commentBody = "this is a test comment";
  const comments: IComment[] = [{ label: "test", comment: commentBody }];

  return handle(context, comments).then((resp) => {
    expect(github.commentsAdded).toEqual([]);
    expect(github.comments).toEqual([]);
  });
});

it("removes a comment when the label is removed", () => {
  expect.assertions(2);
  const commentBody = "this is a test comment";
  const github = new FakeGithub([commentBody]);
  const context = new FakeContext({ label: { name: "test" }, issue: { labels: []}}, github, {});
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
  const context = new FakeContext({ label: { name: "this" }, issue: { labels: []}}, github, {});
  const comments: IComment[] = [{ label: "test", comment: commentBody }];

  return handle(context, comments).then((resp) => {
    expect(github.commentsAdded).toEqual([]);
    expect(github.commentsRemoved).toEqual([]);
  });
});
