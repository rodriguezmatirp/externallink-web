import React from "react";
import { Modal } from "react-responsive-modal";
import useInputState from "../../hooks/useInputState";
import "react-responsive-modal/styles.css";
import axios from "axios";
import { addSitemap } from "./../../utils/routes";
import { toast } from "react-toastify";

export default function Form(props) {
  const [link, handleLinkChange, rL] = useInputState("");
  document.title = "Add Site"
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/(https|http):\/\/.*\/$/.test(link)) {
      toast.error("Check the url")
    } else {
      var webpage = link + 'sitemap.xml'
      var extracted_title = link.match(/:\/\/(.[^/]+)/)[1];
      console.log(extracted_title)
      console.log(webpage)
      let body = { domainSitemap: webpage };
      try {
        await axios.post(addSitemap, body);
        // axios.post(scrapData, { url: webpage });
        props.toggleModal(false);
        rL();
        toast.success("Sitemap Added");
        window.location = "/home";
      } catch (error) {
        props.toggleModal(false);
        rL();
        toast.error("Something went wrong");
      }
    }
  };
  const style = {
    modal: {
      background: "#e7f6fd",
      maxWidth: "600px",
      width: "100%",
      borderRadius: "20px"
    },
  };

  return (
    <Modal
      open={props.modalIsOpen}
      onClose={() => props.toggleModal(false)}
      center
      styles={style}
    >
      <div className="container col-lg-10">
        <div>
          {/* <div className="col-lg-4 col-md-5 col-12 pb-4"> */}
          <div className="col-lg-12">
            <h4 className=" mt-4 mb-4">
              {" "}
              <strong>Add Sitemap</strong>
            </h4>
          </div>
          <form>
            <div className="col-lg-12">
              <div className="form-group">
                <label htmlFor="url">Url:</label>
                <input
                  type="text"
                  // pattern="/[http|https]:\/\/.*.com\/$/"
                  className="form-control"
                  value={link}
                  onChange={handleLinkChange}
                />
              </div>
            </div>
            <div className="col-lg-6 mt-4">
              <button
                type="submit"
                className={`btn btn-outline-primary btn-block`}
                onClick={handleSubmit}
              >
                Add
                  </button>
            </div>
          </form>
          <div className="col-lg-6 mt-4"></div>
        </div>
        {/* </div> */}
      </div>
    </Modal>
  );
}
