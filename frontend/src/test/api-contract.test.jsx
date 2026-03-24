import "@testing-library/jest-dom/vitest";
import { describe, expect, it, beforeEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "./msw/server";
import {
  changePassword,
  checkEmail,
  getMyPage,
  getNewRefreshToken,
  login,
  resetPassword,
  sendPasswordResetVerification,
  sendVerification,
  signup,
  verifyEmail,
} from "../apis/user";
import { TimeLineAPI } from "../apis/common";
import { BoardsAPI } from "../apis/boards";
import { PostsAPI } from "../apis/posts";
import { CommentsAPI } from "../apis/comments";
import { AdminUsersAPI } from "../apis/adminUsers";
import { DevAPI } from "../apis/dev";

describe("API contract", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("matches auth and user endpoints from swagger", async () => {
    const captures = {
      signupVerification: null,
      verifySignupEmail: null,
      signup: null,
      emailCheck: null,
      passwordResetVerification: null,
      passwordReset: null,
      loginAuth: null,
      meAuth: null,
      changePassword: null,
      refreshAuth: null,
    };

    server.use(
      http.post("*/api/auth/signup/send-verification", async ({ request }) => {
        captures.signupVerification = await request.json();
        return HttpResponse.json({});
      }),
      http.post("*/api/auth/signup/verify-email", async ({ request }) => {
        captures.verifySignupEmail = await request.json();
        return HttpResponse.json({});
      }),
      http.post("*/api/auth/signup", async ({ request }) => {
        captures.signup = await request.json();
        return HttpResponse.json({});
      }),
      http.post("*/api/auth/check-email", async ({ request }) => {
        captures.emailCheck = await request.json();
        return HttpResponse.json({});
      }),
      http.post(
        "*/api/auth/password-reset/send-verification",
        async ({ request }) => {
          captures.passwordResetVerification = await request.json();
          return HttpResponse.json({});
        }
      ),
      http.post("*/api/auth/reset-password", async ({ request }) => {
        captures.passwordReset = await request.json();
        return HttpResponse.json({ temporaryPassword: "Temp1234" });
      }),
      http.post("*/api/auth/login", async ({ request }) => {
        captures.loginAuth = await request.json();
        return HttpResponse.json(
          {
            id: 3,
            name: "테스트 사용자",
            email: "member@example.com",
            type: "MEMBER",
          },
          {
            headers: {
              Authorization: "Bearer mocked-access-token",
            },
          }
        );
      }),
      http.get("*/api/users/me", async ({ request }) => {
        captures.meAuth = request.headers.get("authorization");
        return HttpResponse.json({
          id: 3,
          name: "테스트 사용자",
          email: "member@example.com",
          type: "MEMBER",
        });
      }),
      http.patch("*/api/users/password-change", async ({ request }) => {
        captures.changePassword = {
          auth: request.headers.get("authorization"),
          body: await request.json(),
        };
        return HttpResponse.json({});
      }),
      http.post("*/api/auth/refresh", async ({ request }) => {
        captures.refreshAuth = request.headers.get("authorization");
        return HttpResponse.json(
          {},
          {
            headers: {
              Authorization: "Bearer refreshed-token",
            },
          }
        );
      })
    );

    await sendVerification("member@example.com");
    await verifyEmail("member@example.com", "A1B2C3");
    await signup("홍길동", "member@example.com", "Abcd1234", "A1B2C3");
    await checkEmail("member@example.com");
    await sendPasswordResetVerification("member@example.com");
    await expect(
      resetPassword("member@example.com", "R3S3T")
    ).resolves.toEqual({
      temporaryPassword: "Temp1234",
    });

    await expect(login("member@example.com", "Abcd1234")).resolves.toMatchObject({
      email: "member@example.com",
    });
    expect(localStorage.getItem("accessToken")).toBe("mocked-access-token");

    await getMyPage();
    await changePassword({
      currentPassword: "Old12345",
      newPassword: "New12345",
      newPasswordConfirm: "New12345",
    });
    await expect(getNewRefreshToken()).resolves.toEqual({
      accessToken: "refreshed-token",
      data: {},
    });

    expect(captures.signupVerification).toEqual({
      email: "member@example.com",
    });
    expect(captures.verifySignupEmail).toEqual({
      email: "member@example.com",
      code: "A1B2C3",
    });
    expect(captures.signup).toEqual({
      name: "홍길동",
      email: "member@example.com",
      password: "Abcd1234",
      code: "A1B2C3",
    });
    expect(captures.emailCheck).toEqual({
      email: "member@example.com",
    });
    expect(captures.passwordResetVerification).toEqual({
      email: "member@example.com",
    });
    expect(captures.passwordReset).toEqual({
      email: "member@example.com",
      code: "R3S3T",
    });
    expect(captures.loginAuth).toEqual({
      email: "member@example.com",
      password: "Abcd1234",
    });
    expect(captures.meAuth).toBe("Bearer mocked-access-token");
    expect(captures.changePassword).toEqual({
      auth: "Bearer mocked-access-token",
      body: {
        currentPassword: "Old12345",
        newPassword: "New12345",
        newPasswordConfirm: "New12345",
      },
    });
    expect(captures.refreshAuth).toBe("Bearer mocked-access-token");
  });

  it("maps timeline CRUD to admin schedules and normalizes date responses", async () => {
    const captures = {
      create: null,
      listParams: null,
      update: null,
      removeId: null,
    };

    localStorage.setItem("accessToken", "timeline-token");

    server.use(
      http.post("*/api/admin/schedules", async ({ request }) => {
        captures.create = {
          auth: request.headers.get("authorization"),
          body: await request.json(),
        };
        return HttpResponse.json({
          id: 1,
          title: "개강총회",
          description: "설명",
          color: "123456",
          date: "2026-03-25",
        });
      }),
      http.get("*/api/schedules", ({ request }) => {
        const url = new URL(request.url);
        captures.listParams = {
          from: url.searchParams.get("from"),
          to: url.searchParams.get("to"),
        };
        return HttpResponse.json({
          from: "2026-03-01",
          to: "2026-03-31",
          data: [
            {
              id: 1,
              title: "개강총회",
              description: "설명",
              color: "123456",
              date: "2026-03-25",
            },
          ],
        });
      }),
      http.patch("*/api/admin/schedules/:scheduleId", async ({ params, request }) => {
        captures.update = {
          id: params.scheduleId,
          body: await request.json(),
        };
        return HttpResponse.json({
          id: Number(params.scheduleId),
          title: "수정된 일정",
          description: "",
          color: "654321",
          date: "2026-03-26",
        });
      }),
      http.delete("*/api/admin/schedules/:scheduleId", ({ params }) => {
        captures.removeId = params.scheduleId;
        return HttpResponse.json({});
      })
    );

    await TimeLineAPI.createTimeLine({
      title: "개강총회",
      description: "설명",
      color: "#123456",
      start: "2026-03-25T00:00",
      end: "2026-03-26T23:59",
    });

    const listResponse = await TimeLineAPI.getTimeLine("2026-03-01", "2026-03-31");

    await TimeLineAPI.updateTimeLine({
      id: 1,
      title: "수정된 일정",
      description: "",
      color: "#654321",
      start: "2026-03-26T00:00",
      end: "2026-03-26T23:59",
    });

    await TimeLineAPI.deleteTimeLine(1);

    expect(captures.create).toEqual({
      auth: "Bearer timeline-token",
      body: {
        title: "개강총회",
        description: "설명",
        color: "123456",
        date: "2026-03-25",
      },
    });
    expect(captures.listParams).toEqual({
      from: "2026-03-01",
      to: "2026-03-31",
    });
    expect(listResponse.data.data[0]).toMatchObject({
      id: 1,
      date: "2026-03-25",
      start: "2026-03-25T00:00",
      end: "2026-03-25T23:59",
    });
    expect(captures.update).toEqual({
      id: "1",
      body: {
        title: "수정된 일정",
        description: "",
        color: "654321",
        date: "2026-03-26",
      },
    });
    expect(captures.removeId).toBe("1");
  });

  it("matches board, post, and comment endpoints", async () => {
    const captures = {
      boardsList: null,
      boardGet: null,
      boardCreate: null,
      boardUpdate: null,
      boardDelete: null,
      postsList: null,
      postGet: null,
      postCreate: null,
      postUpdate: null,
      postDelete: null,
      commentsList: null,
      commentGet: null,
      commentCreate: null,
      commentUpdate: null,
      commentDelete: null,
    };

    localStorage.setItem("accessToken", "board-token");

    server.use(
      http.get("*/api/boards", ({ request }) => {
        const url = new URL(request.url);
        captures.boardsList = {
          page: url.searchParams.get("page"),
          size: url.searchParams.get("size"),
        };
        return HttpResponse.json({
          data: [],
          totalElements: 0,
          totalPages: 0,
          currentPage: 0,
        });
      }),
      http.get("*/api/boards/:boardId", ({ params }) => {
        captures.boardGet = params.boardId;
        return HttpResponse.json({ id: Number(params.boardId) });
      }),
      http.post("*/api/boards", async ({ request }) => {
        captures.boardCreate = await request.json();
        return HttpResponse.json({ id: 1 });
      }),
      http.patch("*/api/boards/:boardId", async ({ params, request }) => {
        captures.boardUpdate = {
          id: params.boardId,
          body: await request.json(),
        };
        return HttpResponse.json({ id: Number(params.boardId) });
      }),
      http.delete("*/api/boards/:boardId", ({ params }) => {
        captures.boardDelete = params.boardId;
        return HttpResponse.json({});
      }),
      http.get("*/api/posts", ({ request }) => {
        const url = new URL(request.url);
        captures.postsList = {
          boardId: url.searchParams.get("boardId"),
          page: url.searchParams.get("page"),
          size: url.searchParams.get("size"),
        };
        return HttpResponse.json({
          data: [],
          totalElements: 0,
          totalPages: 0,
          currentPage: 0,
        });
      }),
      http.get("*/api/posts/:postId", ({ params }) => {
        captures.postGet = params.postId;
        return HttpResponse.json({ id: Number(params.postId) });
      }),
      http.post("*/api/posts", async ({ request }) => {
        captures.postCreate = await request.json();
        return HttpResponse.json({ id: 2 });
      }),
      http.patch("*/api/posts/:postId", async ({ params, request }) => {
        captures.postUpdate = {
          id: params.postId,
          body: await request.json(),
        };
        return HttpResponse.json({ id: Number(params.postId) });
      }),
      http.delete("*/api/posts/:postId", ({ params }) => {
        captures.postDelete = params.postId;
        return HttpResponse.json({});
      }),
      http.get("*/api/comments", ({ request }) => {
        const url = new URL(request.url);
        captures.commentsList = {
          postId: url.searchParams.get("postId"),
          page: url.searchParams.get("page"),
          size: url.searchParams.get("size"),
        };
        return HttpResponse.json({
          data: [],
          totalElements: 0,
          totalPages: 0,
          currentPage: 0,
        });
      }),
      http.get("*/api/comments/:commentId", ({ params }) => {
        captures.commentGet = params.commentId;
        return HttpResponse.json({ id: Number(params.commentId) });
      }),
      http.post("*/api/comments", async ({ request }) => {
        captures.commentCreate = await request.json();
        return HttpResponse.json({ id: 3 });
      }),
      http.patch("*/api/comments/:commentId", async ({ params, request }) => {
        captures.commentUpdate = {
          id: params.commentId,
          body: await request.json(),
        };
        return HttpResponse.json({ id: Number(params.commentId) });
      }),
      http.delete("*/api/comments/:commentId", ({ params }) => {
        captures.commentDelete = params.commentId;
        return HttpResponse.json({});
      })
    );

    await BoardsAPI.list({ page: 1, size: 5 });
    await BoardsAPI.get(10);
    await BoardsAPI.create({
      title: "공지",
      description: "공지 게시판",
      type: "ANNOUNCEMENT",
    });
    await BoardsAPI.update(10, {
      title: "자유",
      description: "자유 게시판",
      type: "COMMUNITY",
    });
    await BoardsAPI.remove(10);

    await PostsAPI.list({ boardId: 10, page: 2, size: 7 });
    await PostsAPI.get(22);
    await PostsAPI.create({
      boardId: 10,
      title: "첫 글",
      content: "본문",
      type: "GENERAL",
    });
    await PostsAPI.update(22, {
      title: "수정 글",
      content: "수정 본문",
      type: "QUESTION",
    });
    await PostsAPI.remove(22);

    await CommentsAPI.list({ postId: 22, page: 0, size: 30 });
    await CommentsAPI.get(33);
    await CommentsAPI.create({
      postId: 22,
      content: "댓글",
    });
    await CommentsAPI.update(33, {
      content: "수정 댓글",
    });
    await CommentsAPI.remove(33);

    expect(captures.boardsList).toEqual({ page: "1", size: "5" });
    expect(captures.boardGet).toBe("10");
    expect(captures.boardCreate).toEqual({
      title: "공지",
      description: "공지 게시판",
      type: "ANNOUNCEMENT",
    });
    expect(captures.boardUpdate).toEqual({
      id: "10",
      body: {
        title: "자유",
        description: "자유 게시판",
        type: "COMMUNITY",
      },
    });
    expect(captures.boardDelete).toBe("10");

    expect(captures.postsList).toEqual({
      boardId: "10",
      page: "2",
      size: "7",
    });
    expect(captures.postGet).toBe("22");
    expect(captures.postCreate).toEqual({
      boardId: 10,
      title: "첫 글",
      content: "본문",
      type: "GENERAL",
    });
    expect(captures.postUpdate).toEqual({
      id: "22",
      body: {
        title: "수정 글",
        content: "수정 본문",
        type: "QUESTION",
      },
    });
    expect(captures.postDelete).toBe("22");

    expect(captures.commentsList).toEqual({
      postId: "22",
      page: "0",
      size: "30",
    });
    expect(captures.commentGet).toBe("33");
    expect(captures.commentCreate).toEqual({
      postId: 22,
      content: "댓글",
    });
    expect(captures.commentUpdate).toEqual({
      id: "33",
      body: {
        content: "수정 댓글",
      },
    });
    expect(captures.commentDelete).toBe("33");
  });

  it("matches admin user and dev endpoints", async () => {
    const captures = {
      usersList: null,
      userGet: null,
      userDelete: null,
      roleChange: null,
      userPosts: null,
      userComments: null,
      dashboard: false,
      devChangeRole: null,
    };

    localStorage.setItem("accessToken", "admin-token");

    server.use(
      http.get("*/api/admin/users", ({ request }) => {
        const url = new URL(request.url);
        captures.usersList = {
          keyword: url.searchParams.get("keyword"),
          type: url.searchParams.get("type"),
          page: url.searchParams.get("page"),
          size: url.searchParams.get("size"),
          sort: url.searchParams.getAll("sort"),
        };
        return HttpResponse.json({ content: [] });
      }),
      http.get("*/api/admin/users/dashboard", () => {
        captures.dashboard = true;
        return HttpResponse.json({ totalUsers: 10 });
      }),
      http.get("*/api/admin/users/:userId", ({ params }) => {
        captures.userGet = params.userId;
        return HttpResponse.json({ id: Number(params.userId) });
      }),
      http.delete("*/api/admin/users/:userId", ({ params }) => {
        captures.userDelete = params.userId;
        return HttpResponse.json({});
      }),
      http.patch("*/api/admin/users/:userId/role", async ({ params, request }) => {
        captures.roleChange = {
          id: params.userId,
          body: await request.json(),
        };
        return HttpResponse.json({ id: Number(params.userId) });
      }),
      http.get("*/api/admin/users/:userId/posts", ({ params, request }) => {
        const url = new URL(request.url);
        captures.userPosts = {
          id: params.userId,
          page: url.searchParams.get("page"),
          size: url.searchParams.get("size"),
          sort: url.searchParams.getAll("sort"),
        };
        return HttpResponse.json({ content: [] });
      }),
      http.get("*/api/admin/users/:userId/comments", ({ params, request }) => {
        const url = new URL(request.url);
        captures.userComments = {
          id: params.userId,
          page: url.searchParams.get("page"),
          size: url.searchParams.get("size"),
          sort: url.searchParams.getAll("sort"),
        };
        return HttpResponse.json({ content: [] });
      }),
      http.get("*/api/dev/change-role", ({ request }) => {
        const url = new URL(request.url);
        captures.devChangeRole = {
          email: url.searchParams.get("email"),
          role: url.searchParams.get("role"),
        };
        return HttpResponse.json({});
      })
    );

    await AdminUsersAPI.list({
      keyword: "kim",
      type: "MEMBER",
      pageable: {
        page: 1,
        size: 20,
        sort: ["createdAt,desc"],
      },
    });
    await AdminUsersAPI.get(9);
    await AdminUsersAPI.remove(9);
    await AdminUsersAPI.changeRole(9, "MANAGER");
    await AdminUsersAPI.getPosts(9, {
      page: 2,
      size: 5,
      sort: ["id,desc"],
    });
    await AdminUsersAPI.getComments(9, {
      page: 3,
      size: 7,
      sort: ["id,asc"],
    });
    await AdminUsersAPI.getDashboard();
    await DevAPI.changeRole({
      email: "admin@example.com",
      role: "MEMBER",
    });

    expect(captures.usersList).toEqual({
      keyword: "kim",
      type: "MEMBER",
      page: "1",
      size: "20",
      sort: ["createdAt,desc"],
    });
    expect(captures.userGet).toBe("9");
    expect(captures.userDelete).toBe("9");
    expect(captures.roleChange).toEqual({
      id: "9",
      body: {
        type: "MANAGER",
      },
    });
    expect(captures.userPosts).toEqual({
      id: "9",
      page: "2",
      size: "5",
      sort: ["id,desc"],
    });
    expect(captures.userComments).toEqual({
      id: "9",
      page: "3",
      size: "7",
      sort: ["id,asc"],
    });
    expect(captures.dashboard).toBe(true);
    expect(captures.devChangeRole).toEqual({
      email: "admin@example.com",
      role: "MEMBER",
    });
  });
});
