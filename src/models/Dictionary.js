import { createModel } from '@rematch/core'
import {
  queryByPage,
  queryById,
  deleteById,
  addByDictFn,
  groupByDict,
  deleteByTypeId,
  getQueryAll,
  getDictDataList,
  addByDict,
  addByDictData,
  editByDict,
  editByDictData,
} from '../servers/dictionary'
import { Notify } from 'uiw'

const searchParamTime = {
  begin: '',
  end: '',
}

// const NotifySuccess = (texe) => {

const NotifySuccess = (message) => {
  return Notify.success({ title: message, description: '' })
}

export default createModel()({
  name: 'dictionary',
  state: {
    searchParams: { ...searchParamTime },
    page: 1,
    pageSize: 10,
    total: 0,
    listData: [],
    listInfoData: {},
    loading: false,
    drawerVisible: false,
    modalVisible: false,
    tableType: '',
    modalType: '',
    queryInfo: {},
    detailInfo: {},
    dictAllData: [],
    dictDataList: [],
    isOpen: false,
    ids: '',
  },
  effects: (dispatch) => {
    return {
      // 分页查询字典列表数据
      async queryByPage(payload, { dictionary }) {
        const { pageSize, page } = dictionary
        const params = {
          pageSize,
          page,
          ...payload,
        }
        const data = await queryByPage(params)
        if (data.code === 200) {
          dispatch.dictionary.update({
            listData: data?.data.rows || [],
            total: data?.data.total,
            page: data?.data.pageNum || page,
            pageSize: data?.data.pageSize || pageSize,
          })
        }
      },
      // 新增字典类型
      async addByDict(payload, dictionary) {
        const dph = dispatch
        const data = await addByDict(payload)
        if (data.code === 200) {
          dph.dictionary.update({
            drawerVisible: false,
            drawerVisiText: '',
          })
          dictionary.dictionary.tablePro.onSearch()
        }
      },
      // 新增字典
      async addByDictData(payload, dictionary) {
        const dph = dispatch
        const data = await addByDictData(payload)
        if (data.code === 200) {
          dph.dictionary.update({
            modalVisible: false,
            drawerVisiText: '',
          })
          dictionary.dictionary.tablePro.onSearch()
        }
      },
      // 修改字典类型
      async editByDict(payload, dictionary) {
        const dph = dispatch
        const data = await editByDict(payload)
        if (data.code === 200) {
          dph.dictionary.update({
            drawerVisible: false,
            drawerVisiText: '',
          })
          dictionary.dictionary.tablePro.onSearch()
        }
      },
      // 修改字典
      async editByDictData(payload, dictionary) {
        const dph = dispatch
        const data = await editByDictData(payload)
        if (data.code === 200) {
          dph.dictionary.update({
            modalVisible: false,
            drawerVisiText: '',
          })
          dictionary.dictionary.tablePro.onSearch()
        }
      },
      // 职位列表
      async getQueryAll(payload) {
        const data = await getQueryAll(payload)
        if (data.code === 200) {
          dispatch.dictionary.update({
            dictAllData:
              data?.rows?.filter((code) => code?.status === '0') || [],
          })
        }
      },
      // 通过字典id查询字典信息
      async queryById(payload) {
        const data = await queryById(payload)
        if (data.code === 200) {
          dispatch.dictionary.update({ listInfoData: data?.data || {} })
        }
      },
      // 根据id删除字典项
      async deleteById(payload) {
        const data = await deleteById(payload)
        return data
      },
      // 根据id删除字典类型
      async deleteByTypeId(payload) {
        const data = await deleteByTypeId(payload)
        return data
      },
      // 修改字典
      async editDict(payload) {
        const data = await editByDict(payload)
        if (data.code === 200) {
          dispatch.dictionary.update({ listInfoData: data?.data || {} })
          NotifySuccess(data.message)
        }
      },
      // 增加字典
      async addDict(payload) {
        const { record, callback } = payload
        const data = await addByDictFn(record)
        if (data.code === 200) {
          NotifySuccess(data.message)
          callback && payload.callback(true)
          dispatch.dictionary.update({ modalVisible: false })
        }
      },
      // 通过字典id查询字典信息
      async getDictDataList(payload) {
        const data = await getDictDataList(payload)
        if (data.code === 200) {
          dispatch.dictionary.update({ dictDataList: data?.data || {} })
        }
      },

      // 分组出不同类型的字典
      async groupByDict() {
        const data = await groupByDict()
        data.code === 200 && NotifySuccess(data.message)
      },
      clean() {
        const dph = dispatch
        dph.dictionary.update({
          drawerVisible: false,
          modalVisible: false,
          queryInfo: {},
          isView: false,
        })
      },
    }
  },
  reducers: {
    update: (state, payload) => {
      return { ...state, ...payload }
    },
  },
})
