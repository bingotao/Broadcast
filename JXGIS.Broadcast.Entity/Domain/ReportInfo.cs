using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.Broadcast.Entity
{
    [Table("ReportInfo")]
    public class ReportInfo
    {
        [Key]
        public string ID { get; set; }

        public string Title { get; set; }

        private DateTime _ReportTime = DateTime.Now;

        public DateTime? ReportTime
        {
            get { return this._ReportTime; }
            set { this._ReportTime = value ?? DateTime.Now; }
        }

        public string ClientInfo { get; set; }

        public string Content { get; set; }

        public string ContactInfo { get; set; }

        private string _Status = "待审核";
        public string Status
        {
            get { return this._Status; }
            set { this._Status = value ?? "待审核"; }
        }

        private int _IsValid = 1;
        public int? IsValid
        {
            get { return this._IsValid; }
            set { this._IsValid = value ?? 1; }
        }

        public string Geometry { get; set; }
    }
}
