using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.Broadcast.BaseLib
{
    /// <summary>
    /// 返回数据对象
    /// </summary>
    public class ReturnObject
    {
        /// <summary>
        /// 数据对象
        /// </summary>
        private Dictionary<string, object> m_Dict = new Dictionary<string, object>();
        public string ErrorMessage = null;


        public ReturnObject()
        { }
        /// <summary>
        /// 以错误消息初始化返回对象
        /// </summary>
        /// <param name="ErrorMessage"></param>
        public ReturnObject(string ErrorMessage)
        {
            this.ErrorMessage = ErrorMessage;
        }

        /// <summary>
        /// 数据对象
        /// </summary>
        public Dictionary<string, object> Data
        {
            get { return this.m_Dict; }
            set { this.m_Dict = value; }
        }

        /// <summary>
        /// 添加数据
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public void AddData(string key, object value)
        {
            this.m_Dict[key] = value;
        }

    }
}
