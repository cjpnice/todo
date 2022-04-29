<template>
  <transition name="el-zoom-in-center">
    <el-card class="container" v-if="disShowLogin">
      <h1>Hi! {{ userName }},欢迎使用Todo！</h1>
      <center v-if="!isLogin">
        <h2>你还没登录哦 ！</h2>
        <el-button
          plain
          @click="change('login')"
          style="margin-top: 20px"
          type="success"
          >登 录</el-button
        >
      </center>
      <center v-if="isLogin">
        <div class="input-add">
          <input
            type="text"
            v-model="todoContent"
            placeholder="输入你的计划吧"
          />
          <button @click="addTodo">
            <i class="plus"></i>
          </button>
        </div>
        <div class="filters">
          <span
            v-for="filter in filters"
            :key="filter.value"
            @click="filterclick(filter.value)"
            class="filter"
            :class="{ active: selected === filter.value }"
            >{{ filter.label }}</span
          >
        </div>

        <div class="todo-list">
          <todo-list-item
            v-for="todo in todos"
            :key="todo.id"
            @change-state="todo.completed = $event.target.checked"
            :todo-item="todo"
            @click="updateFinished(todo.id, $event.target.checked)"
          ></todo-list-item>
        </div>
      </center>
    </el-card>
  </transition>

  <transition name="el-zoom-in-center">
    <el-card class="container" v-if="showLogin">
      <h1>登录 Todo</h1>
      <center>
        <div>
          <input
            type="text"
            v-model="userName"
            placeholder="请输入用户名"
            class="inputclass"
          />
        </div>
        <div>
          <input
            type="password"
            v-model="password"
            placeholder="请输入密码"
            class="inputclass"
          />
        </div>

        <el-button
          type="primary"
          round
          size="large"
          style="margin-top: 20px; margin-right: 20px"
          @click="change('regist')"
          >前往注册</el-button
        >
        <el-button
          type="success"
          round
          size="large"
          style="margin-top: 20px; margin-left: 20px"
          @click="handleLogin"
          >登 录</el-button
        >
      </center>
    </el-card>
  </transition>

  <transition name="el-zoom-in-center">
    <el-card class="container" v-if="showRegist">
      <h1>注册 Todo</h1>
      <center>
        <div>
          <input
            type="text"
            v-model="userName"
            placeholder="请输入用户名"
            class="inputclass"
          />
        </div>
        <div>
          <input
            type="password"
            v-model="password"
            placeholder="请输入密码"
            class="inputclass"
          />
        </div>
        <el-button
          type="primary"
          round
          size="large"
          style="margin-top: 20px; margin-right: 20px"
          @click="change('login')"
          >前往登录</el-button
        >
        <el-button
          type="success"
          round
          size="large"
          style="margin-top: 20px; margin-left: 20px"
          @click="register"
          >注 册</el-button
        >
      </center>
    </el-card>
  </transition>
</template>

<script lang="ts" setup>
import { fa, tr } from "element-plus/lib/locale";
import { ref, onMounted, watch } from "vue";
import { addUser, login } from "@/api/user";
import {
  addTodoList,
  selectAllTodoList,
  selectFinishedTodoList,
  selectUnfinishedTodoList,
  updateTodoList,
} from "@/api/todolist";
import { ElMessage } from "element-plus";
import Cookies from "js-cookie";
import Qs from "qs";
import TodoListItem from "../components/TodoListItem";
const userName = ref("");
const password = ref("");
const isLogin = ref(false);
const disShowLogin = ref(true);
const showLogin = ref(false);
const showRegist = ref(false);
const todoContent = ref("");
const filters = ref([
  { label: "未完成", value: "todo" },
  { label: "全部", value: "all" },
  { label: "已完成", value: "done" },
]);
const todos = ref([{ id: "", content: "", completed: false }]);
const selected = ref("todo");
var msg = "";
const change = (windowName: string) => {
  if (windowName === "login") {
    disShowLogin.value = false;
    showRegist.value = false;
    setTimeout(() => (showLogin.value = true), 380);
  } else if (windowName === "regist") {
    disShowLogin.value = false;
    showLogin.value = false;
    setTimeout(() => (showRegist.value = true), 380);
  } else {
    showRegist.value = false;
    showLogin.value = false;
    setTimeout(() => (disShowLogin.value = true), 380);
  }
};
const filterclick = (filterSelected: string) => {
  selected.value = filterSelected;
  if (filterSelected == "done") {
    getFinishedList();
  } else if (filterSelected == "todo") {
    getUnfinishedList();
  } else {
    getAllList();
  }
};
const updateFinished = (id: any, checked: any) => {
  updateTodoList(
    Qs.stringify({
      id: id,
      isFinished: checked ? 1 : 0,
    })
  ).then((res: any) => {
    if (res.code == 200) {
      if (selected.value == "done") {
        getFinishedList();
      } else if (selected.value == "todo") {
        getUnfinishedList();
      } else {
        getAllList();
      }
    }
  });
};
const addTodo = () => {
  if (todoContent.value == "") {
    ElMessage({
      message: "请先输入你的计划哦",
      type: "warning",
    });
  } else {
    addTodoList(
      Qs.stringify({
        userName: Cookies.get("userName"),
        content: todoContent.value,
      })
    ).then((res: any) => {
      if (res.code == 200) {
        if (selected.value == "done") {
          getFinishedList();
        } else if (selected.value == "todo") {
          getUnfinishedList();
        } else {
          getAllList();
        }
      }
    });
  }
};
const getAllList = () => {
  selectAllTodoList(Qs.stringify({ userName: Cookies.get("userName") })).then(
    (res: any) => {
      if (res.code == 200) {
        todos.value.splice(0, todos.value.length);
        for (var i = 0; i < res.data.length; i++) {
          todos.value.push({
            id: res.data[i].id,
            content: res.data[i].content,
            completed: res.data[i].isFinished,
          });
        }
      }
    }
  );
};
const getFinishedList = () => {
  selectFinishedTodoList(
    Qs.stringify({ userName: Cookies.get("userName") })
  ).then((res: any) => {
    if (res.code == 200) {
      todos.value.splice(0, todos.value.length);
      for (var i = 0; i < res.data.length; i++) {
        todos.value.push({
          id: res.data[i].id,
          content: res.data[i].content,
          completed: res.data[i].isFinished,
        });
      }
    }
  });
};
const getUnfinishedList = () => {
  selectUnfinishedTodoList(
    Qs.stringify({ userName: Cookies.get("userName") })
  ).then((res: any) => {
    if (res.code == 200) {
      todos.value.splice(0, todos.value.length);
      for (var i = 0; i < res.data.length; i++) {
        todos.value.push({
          id: res.data[i].id,
          content: res.data[i].content,
          completed: res.data[i].isFinished,
        });
      }
    }
  });
};
const handleLogin = () => {
  login(
    Qs.stringify({ userName: userName.value, password: password.value })
  ).then((res: any) => {
    if (res.code == 200) {
      ElMessage({
        message: res.message,
        type: "success",
      });
      Cookies.set("isLogin", "true");
      Cookies.set("userName", res.data.userName);
      isLogin.value = true;
      getAllList();
      change("home");
    } else {
      ElMessage({
        message: res.message,
        type: "error",
      });
    }
  });
};
const checkUserNameAndPassword = () => {
  if (userName.value === "" || password.value === "") {
    msg = "请输入用户名和密码";
    return false;
  } else if (userName.value.length > 6 || password.value.length > 20) {
    msg = "用户名长度应小于6位,密码长度应小于20位";
    return false;
  } else if (userName.value.length < 3 || password.value.length < 6) {
    msg = "用户名长度应大于3位,密码长度应大于6位";
    return false;
  } else {
    return true;
  }
};
const register = () => {
  if (checkUserNameAndPassword()) {
    addUser(
      Qs.stringify({ userName: userName.value, password: password.value })
    ).then((res: any) => {
      if (res.code == 200) {
        ElMessage({
          message: "注册成功,前往登陆",
          type: "success",
        });

        change("login");
      } else {
        ElMessage({
          message: res.message,
          type: "error",
        });
      }
    });
  } else {
    ElMessage({
      message: msg,
      type: "error",
    });
  }
};
onMounted(() => {
  if (Cookies.get("isLogin") === "true") {
    isLogin.value = true;
    userName.value = Cookies.get("userName");
    getAllList();
    change("home");
  }
});
</script>

<style scoped>
.container {
  min-width: 340px;
  padding: 48px 28px;
}
.el-card {
  border-radius: 24px;
  width: 50%;
}

/* 标题 */
h1 {
  margin-top: -28px;
  font-size: 24px;
  text-align: center;
  color: #414873;
}

h2 {
  margin-top: 20px;
  font-size: 14px;
  text-align: center;
  color: #656b93;
}

.inputclass {
  margin-top: 20px;
  padding: 16px 52px 16px 18px;
  border-radius: 48px;
  border: none;
  outline: none;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.08);
  width: 100%;
  font-size: 16px;
  color: #626262;
  width: 50%;
}

/* 添加框 */
.input-add {
  position: relative;
  display: flex;
  align-items: center;
  width: 80%;
}

.input-add input {
  padding: 16px 52px 16px 18px;
  border-radius: 48px;
  border: none;
  outline: none;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.08);
  width: 100%;
  font-size: 16px;
  color: #626262;
  margin-top: 20px;
}

.input-add button {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(#c0a5f3, #7f95f7);
  border: none;
  color: white;
  position: absolute;
  right: 0px;
  margin-top: 20px;

  cursor: pointer;
  outline: none;
}

.input-add .plus {
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(#fff, #fff), linear-gradient(#fff, #fff);
  background-size: 50% 2px, 2px 50%;
  background-position: center;
  background-repeat: no-repeat;
}

.filters {
  display: flex;
  margin: 24px 2px;
  color: #c0c2ce;
  font-size: 14px;
  cursor: pointer;
}

.filters .filter {
  margin-right: 14px;
  transition: 0.8s;
  width: 50%;
}

.filters .filter.active {
  color: #6b729c;
  transform: scale(1.2);
}

.todo-list {
  display: grid;
  row-gap: 14px;
}
</style>
