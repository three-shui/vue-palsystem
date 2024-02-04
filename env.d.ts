/// <reference types="vite/client" />
//这里用来解决：无法找到模块“nprogress”的声明文件  这种问题
//其实不解决也可以，但还是解决一下吧
declare module "*s" {
  import { defineComponent } from "vue";
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}