using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.Broadcast.Entity
{
    [Table("PublishedDetail")]
    public class PublishedDetail
    {
        [Key]
        public string ID { get; set; }

        public string SourceID { get; set; }


        public string SourceType { get; set; }

        public string Catagory { get; set; }


        public string Title { get; set; }

        public string Urgency { get; set; }

        public string Content { get; set; }

        public DateTime? PublishTime { get; set; }


        public DateTime? ExpirationTime { get; set; }

        public string Geometry { get; set; }

        public string Status { get; set; }


        private DateTime _CreateTime = DateTime.Now;
        public DateTime? CreateTime
        {
            get { return this._CreateTime; }
            set { this._CreateTime = value ?? DateTime.Now; }
        }

        public string CreateUser { get; set; }

        private DateTime _LastModifyTime = DateTime.Now;
        public DateTime? LastModifyTime
        {
            get { return this._LastModifyTime; }
            set { this._LastModifyTime = value ?? DateTime.Now; }
        }

        public string LastModifyUser { get; set; }

        private int _IsValid = 1;
        public int? IsValid
        {
            get { return this._IsValid; }
            set { this._IsValid = value ?? 1; }
        }

    }
}
