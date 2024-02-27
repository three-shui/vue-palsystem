<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { SpuData } from '@/api/product/spu/type';
import { reqAllTradeMark, reqSpuImageList, reqSpuHasSaleAttr, reqAllSaleAttr, reqAddOrUpdateSpu } from '@/api/product/spu'
import type { SaleAttrValue, HasSaleAttr, SaleAttr, SpuImg, Trademark, AllTradeMark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData } from '@/api/product/spu/type';
import { ElMessage } from "element-plus";
import 'element-plus/es/components/message/style/css'
import type { UploadProps } from 'element-plus'

const emit = defineEmits(['changeScene'])
const cancle = () => {
  emit('changeScene', { flag: 0, params: 'update' })
}

//存储已有的SPU对象
let SpuParams = ref<SpuData>({
  category3Id: "",//收集三级分类的ID
  spuName: "",//SPU的名字
  description: "",//SPU的描述
  tmId: '',//品牌的ID
  spuImageList: [],
  spuSaleAttrList: [],
});
//存储已有的SPU这些数据
let allTradeMark = ref<Trademark[]>([]);
//商品图片
let imgList = ref<SpuImg[]>([]);
//已有的SPU销售属性
let saleAttr = ref<SaleAttr[]>([]);
//全部销售属性
let allSaleAttr = ref<HasSaleAttr[]>([]);

const initHasSpuData = async (spu: SpuData) => {
  //存储已有的SPU对象,将来在模板中展示
  SpuParams.value = spu;
  //spu:即为父组件传递过来的已有的SPU对象[不完整]
  //获取全部品牌的数据
  let result: AllTradeMark = await reqAllTradeMark();
  //获取某一个品牌旗下全部售卖商品的图片
  let result1: SpuHasImg = await reqSpuImageList((spu.id as number));
  //获取已有的SPU销售属性的数据
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr((spu.id as number));
  //获取整个项目全部SPU的销售属性
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr();
  //存储全部品牌的数据
  allTradeMark.value = result.data;
  //SPU对应商品图片
  imgList.value = result1.data.map(item => {
    return {
      name: item.imgName,
      url: item.imgUrl
    }
  })
  //存储已有的SPU的销售属性
  saleAttr.value = result2.data;
  //存储全部的销售属性
  allSaleAttr.value = result3.data;
}


//控制照片放大对话框的显示与隐藏
const dialogVisible = ref(false)
//存储预览图片地址
const dialogImageUrl = ref('')
//照片墙点击预览按钮的时候触发的钩子
const handlePictureCardPreview = (uploadFile: any) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}
//照片墙删除文件钩子
const handleRemove = () => { }
//上传图片之前触发的钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile: any) => {
  if (rawFile.type === 'image/jpeg' || rawFile.type === 'image/png' || rawFile.type === 'image/gif') {
    if (rawFile.size / 1024 / 1024 > 10) {
      ElMessage.error('图片大小不能超过10M!')
      return false
    }
    return true
  } else {
    ElMessage.error('图片格式只能是jpg或png或gif!')
    return false
  }
}

//将来收集还未选择的销售属性的id与属性的名字
const saleAtrIdAndValueName = ref('')

//计算出当前spu还未拥有的销售属性
const unSelectSaleAttr = computed(() => {
  const unSelectArr = allSaleAttr.value.filter(item => {
    return saleAttr.value.every(item1 => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})

//添加销售属性
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAtrIdAndValueName.value.split(':')
  //准备一个新的销售属性对象，将来带给服务器
  const newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: []
  }
  //追加到数组中
  saleAttr.value.push(newSaleAttr)
  //清空收集的数据
  saleAtrIdAndValueName.value = ''
}

//属性值按钮的点击事件
const toEdit = (row: SaleAttr, $index: number) => {
  //点击按钮的时候,input组件不就不出来->编辑模式
  row.flag = true;
  row.saleAttrValue = ''
  nextTick(() => {
    //获取焦点
    inputArr.value[$index].focus()
  })
}
//表单元素失去焦点的事件回调
const toLook = (row: SaleAttr) => {
  //整理收集的属性的ID与属性值的名字
  const { baseSaleAttrId, saleAttrValue } = row;
  //整理成服务器需要的属性值形式
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: (saleAttrValue as string)
  }

  //非法情况判断
  if ((saleAttrValue as string).trim() == '') {
    ElMessage.error('属性值不能为空')
    return;
  }
  //判断属性值是否在数组当中存在
  let repeat = row.spuSaleAttrValueList.find(item => {
    return item.saleAttrValueName == saleAttrValue;
  })

  if (repeat) {
    ElMessage.error('属性值重复')
    return;
  }

  //追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue);
  //切换为查看模式
  row.flag = false;
}

//准备一个数组，将来存储对应的组件实例el-input
const inputArr = ref<any>([])

//保存按钮的回调
const save = async () => {
  //1:照片墙的数据
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,//图片的名字
      imgUrl: (item.response && item.response.data) || item.url
    }
  });
  //2:整理销售属性的数据
  SpuParams.value.spuSaleAttrList = saleAttr.value;
  let result = await reqAddOrUpdateSpu(SpuParams.value);
  if (result.code === 200) {
    ElMessage.success(SpuParams.value.id ? '更新成功' : '添加成功')
    //通知父组件切换场景为0
    emit('changeScene', { flag: 0, params: SpuParams.value.id ? 'update' : 'add' });
  } else {
    ElMessage.error(SpuParams.value.id ? '更新失败' : '添加失败')
  }
}

//添加一个新的SPU初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
  //清空数据
  Object.assign(SpuParams.value, {
    category3Id: "",//收集三级分类的ID
    spuName: "",//SPU的名字
    description: "",//SPU的描述
    tmId: '',//品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
  });
  //清空照片
  imgList.value = [];
  //清空销售属性
  saleAttr.value = [];
  saleAtrIdAndValueName.value = '';
  //存储三级分类的ID
  SpuParams.value.category3Id = c3Id;
  //获取全部品牌的数据
  let result: AllTradeMark = await reqAllTradeMark();
  let result1: HasSaleAttrResponseData = await reqAllSaleAttr();
  //存储数据
  allTradeMark.value = result.data;
  allSaleAttr.value = result1.data;
}

//这里需要把这个方法暴漏出去，这样才能在父组件中调用这个方法
defineExpose({ initHasSpuData, initAddSpu })
</script>

<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <el-input placeholder="请输入SPU名称" v-model="SpuParams.spuName" />
      </el-form-item>
      <el-form-item label="SPU品牌">
        <el-select placeholder="请选择" style="width:180px" v-model="SpuParams.tmId">
          <el-option v-for="item in allTradeMark" :key="item.id" :label="item.tmName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input placeholder="请输入SPU描述" type="textarea" v-model="SpuParams.description" />
      </el-form-item>
      <el-form-item label="SPU图标">
        <el-upload v-model:file-list="imgList" action="http://sph-api.atguigu.cn/admin/product/fileUpload"
          list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
          :before-upload="beforeAvatarUpload">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" style="width:100%;height: 100%;" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="SPU销售属性">
        <el-select v-model="saleAtrIdAndValueName"
          :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : '无'" style="width:180px">
          <el-option :value="`${item.id}:${item.name}`" v-for="item in unSelectSaleAttr" :key="item.id"
            :label="item.name" />
        </el-select>
        <el-button :disabled="saleAtrIdAndValueName ? false : true" type="primary" icon="Plus" style="margin-left:10px"
          @click="addSaleAttr">添加属性</el-button>
      </el-form-item>
      <el-form-item>
        <el-table border :data="saleAttr">
          <el-table-column label="序号" width="80px" align="center" type="index" />
          <el-table-column label="销售属性名字" width="120px" prop="saleAttrName" />
          <el-table-column label="销售属性值">
            <template #="{ row, $index }">
              <el-tag style="margin:0px 5px" @close="row.spuSaleAttrValueList.splice(index, 1)"
                v-for="(item, index) in row.spuSaleAttrValueList" :key="item.id" closable>
                {{ item.saleAttrValueName }}
              </el-tag>
              <el-input :ref="(vc: any) => inputArr[$index] = vc" @blur="toLook(row)" v-model="row.saleAttrValue"
                v-if="row.flag == true" placeholder="请你输入属性值" size="small" style="width:100px"></el-input>
              <el-button @click="toEdit(row, $index)" v-else type="primary" size="small" icon="Plus"></el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80px">
            <template #="{ row, $index }">
              <el-button type="danger" size="small" icon="Delete" @click="saleAttr.splice($index, 1)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save" :disabled="saleAttr.length > 0 ? false : true">保存</el-button>
        <el-button style="margin-left:10px" @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped></style>